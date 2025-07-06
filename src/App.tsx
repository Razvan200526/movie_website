import Search from "./components/search";
import { useState, useEffect } from "react";
import { MovieCard } from "./MovieCard";
const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json", // Accept JSON responses
    Authorization: `Bearer ${API_KEY}`, // Ensure API_KEY is set in your .env file
  },
};

export default function App() {
  const [searchTerm, setSearchTerm] = useState<string | null>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [movies, setMovies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fetchMovies = async () => {
    setIsLoading(true);
    setErrorMessage(null); // Clear any previous error messages
    try {
      const response = await fetch(
        `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`,
        API_OPTIONS,
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMovies(data.results);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setErrorMessage("Failed to fetch movies. Please try again later.");
    }
  };
  useEffect(() => {
    fetchMovies();
  }, []);
  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero" className="hero" />
          <h1>
            Find <span className="text-gradient">movies</span> you'll enjoy
            without hassle
          </h1>

          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>
        <section className="movies">
          {errorMessage && <p className="error">{errorMessage}</p>}
          {isLoading ? (
            <p className="loading">Loading movies...</p>
          ) : (
            movies
              .filter((movie) =>
                movie.title
                  .toLowerCase()
                  .includes(searchTerm?.toLowerCase() || ""),
              )
              .map((movie) => <MovieCard movie={movie} />)
          )}
        </section>
      </div>
    </main>
  );
}
