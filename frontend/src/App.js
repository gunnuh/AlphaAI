import React, { useEffect, useState } from 'react';
import {
  Box, Button, Container, TextField, Typography, List, ListItem, ListItemText,
} from '@mui/material';

const BACKEND_URL = 'http://localhost:5000/api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [status, setStatus] = useState('todo');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const cached = localStorage.getItem('tasks');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          setTasks(parsed);
        } else {
          setTasks([]);
          fetchTasks();
        }
      } catch {
        setTasks([]);
        fetchTasks();
      }
    } else {
      fetchTasks();
    }
  }, []);

  function fetchTasks() {
  fetch(`${BACKEND_URL}/tasks`)
    .then(res => res.json())
    .then(data => {
      console.log("Fetched tasks:", data);  // Debug print
      if (Array.isArray(data)) {
        setTasks(data);
        localStorage.setItem('tasks', JSON.stringify(data));
      } else {
        console.error("Data is not an array:", data);
        setTasks([]);
      }
    })
    .catch(e => {
      console.error("Error fetching tasks:", e);
      setTasks([]);
    });
}


  function addTask() {
    const newTask = { title, description: desc, status };
    fetch(`${BACKEND_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask),
    })
      .then(res => res.json())
      .then(task => {
        const updatedTasks = [...tasks, task];
        setTasks(updatedTasks);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        setTitle('');
        setDesc('');
      })
      .catch(err => {
        console.error('Error adding task:', err);
      });
  }

  function deleteTask(id) {
    fetch(`${BACKEND_URL}/tasks/${id}`, { method: 'DELETE' })
      .then(() => {
        const updatedTasks = tasks.filter(t => t.id !== id);
        setTasks(updatedTasks);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      })
      .catch(err => {
        console.error('Error deleting task:', err);
      });
  }

  function searchTasks() {
    if (!searchQuery.trim()) return setSearchResults([]);
    fetch(`${BACKEND_URL}/tasks/search?q=${encodeURIComponent(searchQuery)}`)
      .then(res => res.json())
      .then(results => {
        if (Array.isArray(results)) {
          setSearchResults(results);
        } else {
          setSearchResults([]);
        }
      })
      .catch(err => {
        console.error('Error searching tasks:', err);
        setSearchResults([]);
      });
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" mb={2}>Task Manager</Typography>

      <Box mb={2}>
        <TextField label="Title" fullWidth value={title} onChange={e => setTitle(e.target.value)} margin="dense" />
        <TextField label="Description" fullWidth value={desc} onChange={e => setDesc(e.target.value)} margin="dense" />
        <TextField label="Status" fullWidth value={status} onChange={e => setStatus(e.target.value)} margin="dense" />
        <Button variant="contained" onClick={addTask} sx={{ mt: 1 }}>Add Task</Button>
      </Box>

      <Typography variant="h6">All Tasks</Typography>
      <List>
        {Array.isArray(tasks) && tasks.map(task => (
          <ListItem key={task.id} secondaryAction={
            <Button color="error" onClick={() => deleteTask(task.id)}>Delete</Button>
          }>
            <ListItemText
              primary={`${task.title} (${task.status})`}
              secondary={task.description}
            />
          </ListItem>
        ))}
      </List>

      <Box mt={4}>
        <TextField
          label="Search tasks by description"
          fullWidth
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') searchTasks(); }}
          margin="dense"
        />
        <Button variant="outlined" onClick={searchTasks} sx={{ mt: 1 }}>Search</Button>

        {searchResults.length > 0 && (
          <>
            <Typography variant="h6" mt={2}>Search Results</Typography>
            <List>
              {searchResults.map(task => (
                <ListItem key={task.id} secondaryAction={
                  <Button color="error" onClick={()=> deleteTask(task.id)}Delete></Button>
                }>
                  <ListItemText
                    primary={`${task.title ?? 'No Title'} (${task.status ?? 'No Status'})`}
                    secondary={task.description ?? 'No Description'}
                  />
                </ListItem>
              ))}
            </List>
          </>
        )}
      </Box>
    </Container>
  );
}

export default App;
