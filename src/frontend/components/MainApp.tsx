import { TrailerModal } from "./TrailerModal";
import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { MediaCard } from "./MediaCard";
import VideoBackground from "./VideoBackGround";
import Layout from "./Layout";
import { apiClient } from "../services/api";
import { MediaItem } from "../types";

interface MainAppProps {
  token: string | null;
  onLogout: () => void;
}

export default function MainApp({ token: _token, onLogout }: MainAppProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedMovie, setSelectedMovie] = useState<MediaItem | null>(null);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleHoverStart = (movie: MediaItem) => {
    hoverTimeout.current = setTimeout(() => {
      setSelectedMovie(movie);
    }, 2000);
  };

  const handleHoverEnd = () => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
      hoverTimeout.current = null;
    }
  };

  const {
    data: moviesResponse,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["movies", "popular"],
    queryFn: () => apiClient.getPopularMovies(),
    refetchOnWindowFocus: false,
  });

  const movies = moviesResponse?.results || [];
  const filteredMovies = movies.filter((movie: MediaItem) => {
    const title = movie.title || movie.name || "";
    return title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <Layout
      onLogout={onLogout}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      showSearch={true}
    >
      <div className="relative h-[70vh] w-full bg-gradient-to-t from-black to-transparent overflow-hidden">
        {movies.length > 0 && (
          <VideoBackground
            movieId={movies[0].id}
            fallbackImage={`https://image.tmdb.org/t/p/original${movies[0]?.backdrop_path}`}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent z-10"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
          {movies.length > 0 && (
            <>
              <h1 className="text-5xl font-bold mb-4">
                {movies[0]?.title || movies[0]?.name}
              </h1>
              <p className="text-lg max-w-2xl mb-6">{movies[0]?.overview}</p>
              <div className="flex space-x-4">
                <button className="bg-white text-black px-6 py-2 rounded-md font-bold flex items-center">
                  <span className="mr-2">▶</span> Play
                </button>
                <button className="bg-gray-600/70 text-white px-6 py-2 rounded-md font-bold">
                  More Info
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="px-4 md:px-8 py-8 -mt-10 relative z-20">
        <h2 className="text-2xl font-bold mb-4">Popular Movies</h2>

        {isError && (
          <div className="bg-red-900/50 text-white p-4 rounded-md mb-6">
            <h3 className="text-xl font-bold">Error fetching movies</h3>
            <p>{error instanceof Error ? error.message : String(error)}</p>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
          </div>
        ) : filteredMovies.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xl text-gray-400">
              {searchTerm
                ? `No movies found matching "${searchTerm}"`
                : "No movies available"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredMovies.map((movie: MediaItem) => (
              <MediaCard
                key={movie.id}
                media={movie}
                mediaType="movie"
                onClick={setSelectedMovie}
                onHoverStart={handleHoverStart}
                onHoverEnd={handleHoverEnd}
              />
            ))}
          </div>
        )}
      </div>

      {selectedMovie && (
        <TrailerModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </Layout>
  );
}
