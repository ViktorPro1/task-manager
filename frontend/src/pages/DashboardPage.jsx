import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function DashboardPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [filter, setFilter] = useState('all');

    const fetchTasks = async () => {
        const res = await api.get(`/tasks${filter !== 'all' ? `?status=${filter}` : ''}`);
        setTasks(res.data);
    };

    useEffect(() => {
        fetchTasks();
    }, [filter]);

    const handleCreate = async (e) => {
        e.preventDefault();
        await api.post('/tasks', { title, description });
        setTitle('');
        setDescription('');
        fetchTasks();
    };

    const handleStatus = async (task) => {
        await api.put(`/tasks/${task.id}`, {
            title: task.title,
            description: task.description,
            status: task.status === 'active' ? 'done' : 'active',
        });
        fetchTasks();
    };

    const handleDelete = async (id) => {
        await api.delete(`/tasks/${id}`);
        fetchTasks();
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Привіт, {user?.name}</h2>
                <button onClick={handleLogout}>Вийти</button>
            </div>

            <form onSubmit={handleCreate} style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Назва задачі"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
                />
                <input
                    type="text"
                    placeholder="Опис"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
                />
                <button type="submit" style={{ width: '100%', padding: '10px' }}>
                    Додати задачу
                </button>
            </form>

            <div style={{ marginBottom: '16px' }}>
                {['all', 'active', 'done'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        style={{ marginRight: '8px', fontWeight: filter === f ? 'bold' : 'normal' }}
                    >
                        {f === 'all' ? 'Всі' : f === 'active' ? 'Активні' : 'Виконані'}
                    </button>
                ))}
            </div>

            {tasks.map((task) => (
                <div key={task.id} style={{ border: '1px solid #ccc', padding: '12px', marginBottom: '8px', borderRadius: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <strong style={{ textDecoration: task.status === 'done' ? 'line-through' : 'none' }}>
                                {task.title}
                            </strong>
                            <p style={{ margin: '4px 0', color: '#666' }}>{task.description}</p>
                        </div>
                        <div>
                            <button onClick={() => handleStatus(task)} style={{ marginRight: '8px' }}>
                                {task.status === 'active' ? '✅' : '↩️'}
                            </button>
                            <button onClick={() => handleDelete(task.id)}>🗑️</button>
                        </div>
                    </div>
                </div>
            ))}

            {tasks.length === 0 && <p style={{ color: '#999' }}>Задач немає</p>}
        </div>
    );
}