const pool = require('../config/db');

const getTasks = async (req, res) => {
    const { status } = req.query;

    try {
        let query = 'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC';
        let params = [req.user.id];

        if (status && status !== 'all') {
            query = 'SELECT * FROM tasks WHERE user_id = $1 AND status = $2 ORDER BY created_at DESC';
            params = [req.user.id, status];
        }

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: 'Помилка сервера', error: err.message });
    }
};

const createTask = async (req, res) => {
    const { title, description } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO tasks (user_id, title, description) VALUES ($1, $2, $3) RETURNING *',
            [req.user.id, title, description]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Помилка сервера', error: err.message });
    }
};

const updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, status } = req.body;

    try {
        const result = await pool.query(
            'UPDATE tasks SET title = $1, description = $2, status = $3 WHERE id = $4 AND user_id = $5 RETURNING *',
            [title, description, status, id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Задачу не знайдено' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Помилка сервера', error: err.message });
    }
};

const deleteTask = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *',
            [id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Задачу не знайдено' });
        }

        res.json({ message: 'Задачу видалено' });
    } catch (err) {
        res.status(500).json({ message: 'Помилка сервера', error: err.message });
    }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };