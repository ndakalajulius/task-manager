import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [token, setToken] = useState(null);
    const [newTask, setNewTask] = useState({ title: '', description: '', category: '' });
    const router = useRouter();

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (!storedToken) {
            router.push('/login');
        } else {
            setToken(storedToken);
            fetchTasks(storedToken);
        }
    }, [router]);

    const fetchTasks = async (token) => {
        const res = await fetch('/api/tasks', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await res.json();
        setTasks(data);
    };

    const addTask = async () => {
        await fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(newTask),
        });
        fetchTasks(token);
    };

    return (
        <div>
            <h1>Task Dashboard</h1>
            <div>
                <input
                    type="text"
                    placeholder="Title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Category"
                    value={newTask.category}
                    onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                />
                <button onClick={addTask}>Add Task</button>
            </div>

            <h2>Tasks</h2>
            <ul>
                {tasks.map((task) => (
                    <li key={task.id}>{task.title} - {task.category}</li>
                ))}
            </ul>
        </div>
    );
}
