import { useState } from "react";
import Search from "../components/search";
import { useQuery } from "@tanstack/react-query";
import { MovieCard } from "../components/MovieCard";

interface MainAppProps {
  token: string | null;
  onLogout: () => void;
}

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const fetchMovies = async () => {
  const response = await fetch(
    `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`,
    API_OPTIONS,
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.results;
};

export default function MainApp({ token, onLogout }: MainAppProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const {
    data: movies = [],
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["movies", "popular"],
    queryFn: fetchMovies,
    refetchOnWindowFocus: false,
  });

  const filteredMovies = movies.filter((movie: any) => {
    return movie.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <img src="./hero.png" alt="Hero" className="hero" />
            <button
              onClick={onLogout}
              style={{ padding: "0.5rem 1rem", fontWeight: "bold" }}
            >
              Logout
            </button>
          </div>
          <h1>
            Find <span className="text-gradient">movies</span> you'll enjoy
            without hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>
        <section className="all-movies">
          {isError && (
            <div className="error">
              <h2>Error fetching movies</h2>
              <p>{error instanceof Error ? error.message : String(error)}</p>
            </div>
          )}
          {isLoading ? (
            <p className="loading">Loading movies...</p>
          ) : filteredMovies.length === 0 ? (
            <p className="no-movies">No movies found.</p>
          ) : (
            <ul>
              {filteredMovies.map((movie: any) => (
                <li key={movie.id}>
                  <MovieCard movie={movie} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
