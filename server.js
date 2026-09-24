const express = require('express');

const app = express();

app.use(express.json());

const notes = [];

app.get('/', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/hello', (req, res) => {
  res.json({ message: 'Hello World' });
});

app.get('/api/notes', (req, res) => {
  res.json(notes);
});

app.post('/api/notes', (req, res) => {
  
 const { title, body } = req.body || {};

 const note = { title, body };

  notes.push(note);

  res.status(201).json(note);
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});