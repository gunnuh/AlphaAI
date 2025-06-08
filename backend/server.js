const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let tasks = [
  { id: 1, title: 'Finish report', description: 'Complete Q3 summary', status: 'todo' },
  { id: 2, title: 'Team meeting', description: 'Discuss project goals', status: 'done' }
];

app.get('/api/tasks', (req, res) => res.json(tasks));

app.post('/api/tasks', (req, res) => {
  const task = req.body;
  task.id = tasks.length ? tasks[tasks.length - 1].id + 1 : 1;
  tasks.push(task);
  res.status(201).json(task);
});

app.delete('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  tasks = tasks.filter(task => task.id !== id);
  res.status(204).send();
});

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
