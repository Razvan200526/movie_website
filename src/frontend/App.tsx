import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { useState } from "react";
import AuthPage from "./components/Auth/AuthPage";
import PrivateRoute from "./components/Auth/PrivateRoute";
import Search from "./components/search";
import { useQuery } from "@tanstack/react-query";
import { MovieCard } from "./components/MovieCard";

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

function MainApp({
  onLogout,
  token,
}: {
  onLogout: () => void;
  token: string | null;
}) {
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
          <img src="./hero.png" alt="Hero" className="hero" />
          <h1>
            Find <span className="text-gradient">movies</span> you'll enjoy
            without hassle
          </h1>
          <button onClick={onLogout} style={{ float: "right" }}>
            Logout
          </button>
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

function AppContent() {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token"),
  );

  function handleLogin(newToken: string) {
    console.log("handleLogin called with token:", newToken);

    // Check if token is valid
    if (!newToken || typeof newToken !== "string" || newToken.length < 5) {
      console.error("Invalid token received:", newToken);
      return;
    }

    setToken(newToken);
    localStorage.setItem("token", newToken);
    console.log("Token stored, redirecting now");

    // Explicitly navigate to the main app route
    navigate("/");
  }

  function handleLogout() {
    setToken(null);
    localStorage.removeItem("token");
    navigate("/auth");
  }

  return (
    <Routes>
      <Route path="/auth" element={<AuthPage onLogin={handleLogin} />} />
      <Route
        path="/*"
        element={
          <PrivateRoute token={token}>
            <MainApp onLogout={handleLogout} token={token} />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
