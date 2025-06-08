import React, { useState } from 'react';

function TaskList({ tasks, onAdd, onDelete }) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [status, setStatus] = useState('todo');

  const handleAdd = () => {
    if (title && desc) {
      onAdd({ title, description: desc, status });
      setTitle('');
      setDesc('');
      setStatus('todo');
    }
  };

  return (
    <div>
      <h2>Add Task</h2>
      <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
      <input placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} />
      <select value={status} onChange={e => setStatus(e.target.value)}>
        <option value="todo">Todo</option>
        <option value="in progress">In Progress</option>
        <option value="done">Done</option>
      </select>
      <button onClick={handleAdd}>Add</button>

      <h2>Task List</h2>
      <ul>
        {tasks.map(t => (
          <li key={t.id}>
            <b>{t.title}</b> - {t.description} [{t.status}]
            <button onClick={() => onDelete(t.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskList;
