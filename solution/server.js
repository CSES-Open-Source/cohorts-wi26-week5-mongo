// Step 2: Load environment variables and Connect to MongoDB
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/moviesDB')
    .then(() => console.log('Connected to MongoDB!'))
    .catch(err => console.error('MongoDB connection error:', err));

// Step 3: Define the Blueprint (Schema) & Interface (Model)
const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    year: { type: Number, required: true },
    director: { type: String, required: true }
});

const Movie = mongoose.model('Movie', movieSchema);

// --- ROUTES ---

// Root Route
app.get('/', (req, res) => {
    res.send("Welcome to the Movie API (MongoDB Edition)!");
});

// Step 5: GET all movies
app.get('/api/movies', async (req, res) => {
    try {
        const movies = await Movie.find({});
        res.json(movies);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Step 5: GET a specific movie by ID
app.get('/api/movies/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (movie) {
            res.json(movie);
        } else {
            res.status(404).json({ message: "Movie not found!" });
        }
    } catch (err) {
        res.status(500).json({ error: "Invalid ID format" });
    }
});

// Step 4: POST a new movie
app.post('/api/movies', async (req, res) => {
    try {
        const newMovie = await Movie.create(req.body);
        res.status(201).json(newMovie);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Step 6: UPDATE a movie
app.put('/api/movies/:id', async (req, res) => {
    try {
        const updatedMovie = await Movie.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (updatedMovie) {
            res.json(updatedMovie);
        } else {
            res.status(404).json({ message: "Movie not found!" });
        }
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Step 7: DELETE a movie
app.delete('/api/movies/:id', async (req, res) => {
    try {
        const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
        if (deletedMovie) {
            res.json({ message: "Movie successfully deleted", deletedMovie });
        } else {
            res.status(404).json({ message: "Movie not found!" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- START SERVER ---
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});