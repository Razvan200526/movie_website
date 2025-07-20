import { useState, useRef } from "react";
import PageSkeleton from "./PageSkeleton";
import { useQuery } from "@tanstack/react-query";
import {apiClient} from "../services/api.ts"
import {TrailerModal} from "./TrailerModal";
import VideoBackGround from "./VideoBackGround";
import { MediaItem } from "../types";
import { MediaCard } from "./MediaCard";

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
    <PageSkeleton
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      onLogout={onLogout}
      showSearch={true}
    >
      <div className="relative h-[70vh] w-full bg-gradient-to-t from-black to-transparent overflow-hidden">
        <VideoBackGround
          movieId={movies.length > 0 ? movies[0].id : 0}
          fallbackImage={movies.length > 0 ? movies[0].backdrop_path || movies[0].poster_path || "" : ""}
        />
        {/* Add any hero/banner content here */}
      </div>
      <div className="px-4 md:px-8 py-8 -mt-10 relative z-20">
        {isLoading && <div>Loading...</div>}
        {isError && <div>Error: {error?.message}</div>}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredMovies.map((movie: MediaItem) => (
            <MediaCard
              key={movie.id}
              media={movie}
              mediaType="movie"
              onHoverStart={handleHoverStart}
              onHoverEnd={handleHoverEnd}
            />
          ))}
        </div>
      </div>
      {selectedMovie && (
        <TrailerModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </PageSkeleton>
  );
}
