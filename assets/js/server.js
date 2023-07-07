const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const dbFilePath = path.join(__dirname, '..', '..', 'db', 'db.json');

// Middleware for static files
app.use(express.static(__dirname + '..'));

// Middleware for parsing JSON request bodies
app.use(express.json());

// Serve the notes.html file
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'notes.html'));
});

// Serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'index.html'));
});

// API routes
app.get('/api/notes', (req, res) => {
  fs.readFile(dbFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Unable to read notes from the database.' });
      return;
    }

    const notes = JSON.parse(data);
    res.json(notes);
  });
});

app.post('/api/notes', (req, res) => {
  fs.readFile(dbFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Unable to read notes from the database.' });
      return;
    }

    const notes = JSON.parse(data);
    const newNote = req.body;
    newNote.id = uuidv4();
    notes.push(newNote);

    fs.writeFile(dbFilePath, JSON.stringify(notes), (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Unable to save the note.' });
        return;
      }

      res.json(newNote);
    });
  });
});

app.delete('/api/notes/:id', (req, res) => {
  fs.readFile(dbFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Unable to read notes from the database.' });
      return;
    }

    const notes = JSON.parse(data);
    const noteId = req.params.id;

    // Find the index of the note with the given ID
    const noteIndex = notes.findIndex((note) => note.id === noteId);

    if (noteIndex === -1) {
      // Note with the given ID was not found
      res.status(404).json({ error: 'Note not found.' });
      return;
    }

    // Remove the note from the array
    notes.splice(noteIndex, 1);

    fs.writeFile(dbFilePath, JSON.stringify(notes), (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Unable to delete the note.' });
        return;
      }

      res.json({ message: 'Note deleted successfully.' });
    });
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API server is running on port ${port}`);
});
