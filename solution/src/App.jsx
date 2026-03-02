import { useState, useEffect } from 'react';
import MovieCard from './components/MovieCard';
import './App.css';

function App() {
  // Initialize state for our movies
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch movies from our newly created MongoDB backend
  useEffect(() => {
    // Make sure your Express server is running on port 3000
    fetch('http://localhost:3000/api/movies')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setMovies(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []); // The empty dependency array ensures this runs only once on mount

  if (loading) return <div>Loading movies from database...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="app-container">
      <h1>My Movie Database</h1>
      <div className="movie-grid">
        {movies.map((movie) => (
          // IMPORTANT: Notice we are using movie._id instead of movie.id 
          // because MongoDB automatically assigns _id fields with an underscore!
          <MovieCard key={movie._id} movie={movie} />
        ))}
      </div>
    </div>
  );
}

export default App;