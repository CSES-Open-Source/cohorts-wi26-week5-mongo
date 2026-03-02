# Week 5: Backend Part 2 - MongoDB & Mongoose

Welcome to the final workshop of the Open Source Cohorts series!

Over the past four weeks, you've gone from writing static web pages to building a functional API:

- **Week 1**: HTML & CSS (The skeleton and styling)
- **Week 2**: Vanilla JavaScript (Adding interactivity)
- **Week 3**: React (Building scalable, component-based UIs)
- **Week 4**: Node.js & Express (Creating a backend server and API)

However, last week, our movie data was stored in an array (`let movies = []`). This created a massive problem: every time we restarted our server, all our data disappeared! Today, we complete the MERN (MongoDB, Express, React, Node.js) stack by integrating a real, persistent database: MongoDB.

## Learning Objectives

By the end of this workshop, you will be able to:

- Understand what a NoSQL database is and how it differs from traditional SQL databases.
- Set up a free cloud database using MongoDB Atlas.
- Connect an Express server to a MongoDB database.
- Use Mongoose (an Object Data Modeling library) to define structures for your data.
- Perform CRUD operations (Create, Read, Update, Delete) on real database records.

## Prerequisites

- Node.js installed on your machine.
- A web browser and a terminal (we will use curl commands to test our API without needing extra software like Postman).

## Step 0: Project Setup

First, let's get our project dependencies installed. We need the tools from last week (express, cors), plus two new ones: mongoose and dotenv.

1. Open your terminal in VS Code (Ctrl + ~ or Cmd + ~)
2. Navigate into the starter folder: `cd starter`
3. Initialize a new Node project and install the dependencies:

```bash
npm install express cors mongoose dotenv
```

**Why these new packages?**

- **mongoose**: MongoDB's native driver is a bit complex. Mongoose acts as a wrapper that makes it incredibly easy to interact with MongoDB using JavaScript objects.
- **dotenv**: We never want to put our database passwords directly into our code (especially before pushing to GitHub). dotenv allows us to load secure variables from a hidden `.env` file.

## Step 1: Get Your MongoDB Connection String (MongoDB Atlas)

If you don't already have a MongoDB connection URI, the easiest way to get one is by creating a free cloud database using MongoDB Atlas.

1. **Sign Up**: Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up for a free account.
2. **Create a Cluster**: Once logged in, create a new Free (M0) cluster. You can leave all the default settings (provider, region) as they are and click Create.
3. **Create a Database User**: You will be prompted to create a user for your database. Choose "Username and Password". Enter a username and a password. Write this password down! You will need it shortly. Click "Create User".
4. **Network Access**: Scroll down to the "IP Access List". To make things easy for local development during this workshop, click "Allow Access from Anywhere" (which adds 0.0.0.0/0), or select "Add My Current IP Address". Then click "Finish and Close".
5. **Get the Connection String**: Go to your Database dashboard. Click the "Connect" button next to your newly created cluster.
   - Select "Drivers" (under "Connect to your application").
   - Copy the connection string provided. It will look something like this:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## Step 2: Connecting to MongoDB

Now let's tell our Express server how to talk to our new database.

1. Create a file named `.env` inside the starter folder.
2. Add your MongoDB connection string to it. Replace `<username>` and `<password>` with the credentials you just created in Step 1.
   - **Note**: You can also specify a database name directly in the URI by replacing the `/` before `?retryWrites` with `/moviesDB`.

```
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/moviesDB?retryWrites=true&w=majority
```

Open `server.js`. At the top of the file, we need to load our environment variables and import Mongoose. Add this code where indicated by the TODO: Step 2 comment (if it says Step 1, update the numbering!):

```javascript
require('dotenv').config(); // Loads variables from .env
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB!'))
  .catch(err => console.error('MongoDB connection error:', err));
```

> **Explanation**: `mongoose.connect()` is an asynchronous operation. It takes time to reach out across the internet to your database. We use `.then()` to log a success message once it connects, and `.catch()` to log any errors (like a wrong password).

## Step 3: Defining a Schema & Model

In MongoDB, data is stored as JSON-like documents. A Schema defines the exact structure or "rules" of those documents, and a Model gives you a programming interface to interact with them.

Add this below your database connection (TODO Step 3):

```javascript
// 1. Define the Blueprint (Schema)
const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    year: { type: Number, required: true },
    director: { type: String, required: true }
});

// 2. Create the Interface (Model)
const Movie = mongoose.model('Movie', movieSchema);
```

> **Explanation**: If someone tries to add a movie without a title, Mongoose will now stop them and throw an error because we set `required: true`.

## Step 4: Create Operations (POST)

Instead of pushing data to an array, we will use our new Movie model to save data directly to the database using the .create() method.

Find the TODO: Step 4 comment and update the POST route:

```javascript
app.post('/api/movies', async (req, res) => {
    try {
        // .create() takes the data from the request body and saves it to MongoDB
        const newMovie = await Movie.create(req.body);
        res.status(201).json(newMovie);
    } catch (err) {
        // If they forget a title, Mongoose throws an error, which we catch here
        res.status(400).json({ error: err.message });
    }
});
```

> **Wait, what is async/await?** Database operations take time! We use the `await` keyword to tell JavaScript to pause and wait for the database to finish saving before moving to the next line of code. Functions that use `await` must be labeled as `async`.

**Testing Step 4 (Terminal):**
Make sure your server is running (`node server.js`), then open a second terminal window and use curl to add a movie:

```bash
curl -X POST http://localhost:3000/api/movies \
     -H "Content-Type: application/json" \
     -d '{"title": "Inception", "year": 2010, "director": "Christopher Nolan"}'
```

## Step 5: Read Operations (GET)

Now that we have data in the database, let's fetch it! We'll use .find() to grab everything, and .findById() to grab a specific movie.

Update your GET routes (TODO Step 5):

```javascript
// GET all movies
app.get('/api/movies', async (req, res) => {
    try {
        // Passing an empty object {} means "find everything"
        const movies = await Movie.find({});
        res.json(movies);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET a specific movie by ID
app.get('/api/movies/:id', async (req, res) => {
    try {
        // Extract the ID from the URL and search the database
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
```

**Testing Step 5 (Browser & Terminal):**

- **Browser**: Simply open your web browser and go to `http://localhost:3000/api/movies`. You should see the movie you added in Step 4!
- **Terminal**: You can also test fetching all movies by typing:
```bash
curl http://localhost:3000/api/movies
```


## Step 6: Update Operations (PUT)

To update a document, we need to know its ID and what new data to apply. We'll use .findByIdAndUpdate().

Update your PUT route (TODO Step 6):

```javascript
app.put('/api/movies/:id', async (req, res) => {
    try {
        const updatedMovie = await Movie.findByIdAndUpdate(
            req.params.id, // 1. The ID to find
            req.body,      // 2. The new data to apply
            { new: true, runValidators: true } // 3. Options
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
```

> **Explanation**: By default, Mongoose returns the old version of the document after an update. We pass `{ new: true }` so it returns the newly updated data back to the user instead. `{ runValidators: true }` ensures the new data still follows our Schema rules.

**Testing Step 6 (Terminal):**
Copy the _id of the movie from Step 5, replace `<YOUR_MOVIE_ID>` below, and run:

```bash
curl -X PUT http://localhost:3000/api/movies/<YOUR_MOVIE_ID> \
     -H "Content-Type: application/json" \
     -d '{"year": 2011}'
```

## Step 7: Delete Operations (DELETE)

Finally, let's give users the power to remove a movie from the database using `.findByIdAndDelete()`.

Update your DELETE route (TODO Step 7):

```javascript
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
```

> **Note**: Mongoose also offers `.deleteOne()` and `.deleteMany()`, but `.findByIdAndDelete()` is the easiest when dealing with a specific API endpoint.

**Testing Step 7 (Terminal):**
Copy a movie _id, replace `<YOUR_MOVIE_ID>` below, and run:

```bash
curl -X DELETE http://localhost:3000/api/movies/<YOUR_MOVIE_ID>
```

## Challenge 1: Connect Your Frontend!

Now that your backend is fully functional with a real database, it's time to connect the React frontend you built in Week 3! This is hard, and not as straightforward as it looks. Spend some time figuring it out. Use the internet, documentation, AI, and any available resources at your disposal. A sample exists in the solution directory (`solution/src/App.jsx`).

**Steps:**

1. Open your Week 3 React project in a separate VS Code terminal.
2. Start the React development server (`npm run dev`).
3. Make sure your Express server from this week is also running (`node server.js` on port 3000).
4. In your React `App.jsx`, remove the hardcoded movies data import.
5. Use the `useEffect` hook and the `fetch()` API to make a GET request to `http://localhost:3000/api/movies`.
6. Store the fetched data in your React state (`const [movies, setMovies] = useState([])`).

**Hints:**

- MongoDB uses `_id` (with an underscore) instead of `id`. You'll need to update your mapping key from `key={movie.id}` to `key={movie._id}` in your React components!
- Your Express server already has `cors` enabled, which allows your React app (usually on port 5173) to securely talk to your Express app (on port 3000).

## Challenge 2: Add Create, Update, and Delete Functionality to the Frontend

Now that you can read movies from the database, try adding the ability to create new movies, update existing ones, and delete movies directly from your React app!

- You will need to create forms for adding and editing movies, and buttons for deleting movies. Each of these actions will correspond to a POST, PUT, or DELETE request to your Express server's API endpoints.
- Use the `fetch()` API to make POST, PUT, and DELETE requests to your Express server's endpoints. Remember to update your React state accordingly after each operation to keep the UI in sync with the database.

## Congratulations! You Built a Full-Stack App!

You have successfully replaced your temporary array with a persistent MongoDB database.

Take a moment to realize what you've accomplished over these 5 weeks:

- You designed a user interface (HTML/CSS).
- You made it interactive (JS/React).
- You built a server to handle requests (Express).
- You connected it to a living, breathing database (MongoDB).

You are officially a Full-Stack MERN Developer. Amazing job!