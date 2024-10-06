import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.userId;

        if (req.method === 'GET') {
            const tasks = await prisma.task.findMany({ where: { userId } });
            res.status(200).json(tasks);
        } else if (req.method === 'POST') {
            const { title, description, category } = req.body;
            const task = await prisma.task.create({
                data: {
                    title,
                    description,
                    category,
                    userId,
                },
            });
            res.status(201).json(task);
        }
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
}
