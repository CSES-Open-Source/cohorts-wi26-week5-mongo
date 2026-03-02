const express = require('express');
const cors = require('cors');

// TODO: Step 2 - Require dotenv and mongoose, then connect to the database

const app = express();
const PORT = 3000;

// Middleware allows our Express server to read JSON bodies and handle CORS
app.use(express.json());
app.use(cors());

// TODO: Step 3 - Define the Movie Schema and Create the Model


// --- ROUTES ---

// Root Route
app.get('/', (req, res) => {
    res.send("Welcome to the Movie API (MongoDB Edition)!");
});

// TODO: Step 5 - GET all movies
app.get('/api/movies', async (req, res) => {
    // Replace array logic with database logic
    res.send("GET all movies route");
});

// TODO: Step 5 - GET a specific movie by ID
app.get('/api/movies/:id', async (req, res) => {
    // Replace array logic with database logic
    res.send(`GET movie with ID: ${req.params.id}`);
});

// TODO: Step 4 - POST a new movie
app.post('/api/movies', async (req, res) => {
    // Replace array logic with database logic
    res.send("POST a new movie route");
});

// TODO: Step 6 - UPDATE a movie
app.put('/api/movies/:id', async (req, res) => {
    // Replace array logic with database logic
    res.send(`UPDATE movie with ID: ${req.params.id}`);
});

// TODO: Step 7 - DELETE a movie
app.delete('/api/movies/:id', async (req, res) => {
    // Replace array logic with database logic
    res.send(`DELETE movie with ID: ${req.params.id}`);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});