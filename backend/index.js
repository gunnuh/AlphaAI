const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'db',
  database: 'tasksdb',
  password: 'yourpassword',
  port: 5432,
});

const EMBEDDING_SERVICE_URL = 'http://embedding-service:6000/embed';

async function getEmbedding(text) {
  const response = await axios.post(EMBEDDING_SERVICE_URL, { texts: [text] });
  return response.data.embeddings[0];
}

app.get('/api/tasks', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, title, description, status FROM tasks ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

app.post('/api/tasks', async (req, res) => {
  const { title, description, status } = req.body;
  try {
    const embedding = await getEmbedding(description);
    const result = await pool.query(
      `INSERT INTO tasks (title, description, status, embedding)
       VALUES ($1, $2, $3, $4) RETURNING id, title, description, status`,
      [title, description, status, embedding]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

app.get('/api/tasks/search', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: 'Query param "q" required' });
  try {
    const queryEmbedding = await getEmbedding(query);
    const result = await pool.query(
      `SELECT id, title, description, status,
              embedding <-> $1 AS distance
       FROM tasks
       ORDER BY distance
       LIMIT 3`,
      [queryEmbedding]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Search failed' });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
