import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MediaCard, MediaItem } from "./MediaCard";
import VideoBackground from "./VideoBackGround";
import { LogoutButton } from "./Auth/Logout";
import { Link } from "react-router-dom";

interface TVShowsPageProps {
  token: string | null;
  onLogout: () => void;
}

const API_BASE_URL = "/api/tmdb";

const fetchTVShows = async () => {
  const response = await fetch(`${API_BASE_URL}/discover/tv`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return data.results;
};

export default function TVShowsPage({
  token: _token,
  onLogout,
}: TVShowsPageProps) {
  const [_selectedShow, setSelectedShow] = useState<MediaItem | null>(null);

  const {
    data: shows = [],
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["tv", "popular"],
    queryFn: fetchTVShows,
    refetchOnWindowFocus: false,
  });

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-black/95 px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center">
          {/* Netflix Logo */}
          <svg
            viewBox="0 0 111 30"
            className="h-7 text-red-600 fill-current mr-8"
            aria-hidden="true"
            focusable="false"
          >
            <g>
              <path d="M105.06 14.28L111 30c-1.75-.25-3.499-.563-5.28-.845l-3.345-8.686-3.437 7.969c-1.687-.282-3.344-.376-5.031-.595l6.031-13.75L94.155 0h5.25l3.194 8.25 3.375-8.25h5.25l-6.157 14.28h.001zm-17.22 0l6.188 14.28c-1.75-.25-3.499-.563-5.28-.845l-3.345-8.686-3.437 7.969c-1.687-.282-3.344-.376-5.031-.595l6.031-13.75L76.935 0h5.25l3.194 8.25 3.375-8.25h5.25l-6.157 14.28h-.001zm-33.001-9.84c0-1.71-.968-3.15-2.655-3.15-1.687 0-2.905 1.44-2.905 3.15v9.84c0 1.71.968 3.15 2.905 3.15 1.687 0 2.655-1.44 2.655-3.15v-9.84zm-2.655 16.995c-5.062 0-9.09-3.97-9.09-8.995v-8.01c0-5.025 4.028-8.995 9.09-8.995 5.06 0 9.09 3.97 9.09 8.995v8.01c0 5.025-4.03 8.995-9.09 8.995zm-13.821 0h-5.436V0h5.436v21.435zM17.165 0v21.435h-5.186V3.57L6.61 21.435H1.674L0 3.57v17.865h-5.186V0h7.866l3.686 15.466L10.277 0h6.888zM30.123 0v21.435h-5.436V0h5.436zm30.406 0v21.435h-5.436v-8.68h-6.658v8.68h-5.438V0h5.438v8.68h6.658V0h5.436z"></path>
            </g>
          </svg>

          <nav className="hidden md:flex space-x-4">
            <Link to="/" className="font-medium text-gray-300 hover:text-white">
              Home
            </Link>
            <Link
              to="/tvshows"
              className="font-medium text-white hover:text-gray-300"
            >
              TV Shows
            </Link>
          </nav>
        </div>

        <LogoutButton onLogout={onLogout} />
      </header>

      {/* Hero Banner */}
      <div className="relative h-[70vh] w-full bg-gradient-to-t from-black to-transparent overflow-hidden">
        {shows.length > 0 && (
          <VideoBackground
            movieId={shows[0].id}
            fallbackImage={`https://image.tmdb.org/t/p/original${shows[0]?.backdrop_path}`}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent z-10"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
          {shows.length > 0 && (
            <>
              <h1 className="text-5xl font-bold mb-4">{shows[0]?.name}</h1>
              <p className="text-lg max-w-2xl mb-6">{shows[0]?.overview}</p>
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

      {/* TV Shows Grid */}
      <div className="px-4 md:px-8 py-8 -mt-10 relative z-20">
        <h2 className="text-2xl font-bold mb-4">Popular TV Shows</h2>

        {isError && (
          <div className="bg-red-900/50 text-white p-4 rounded-md mb-6">
            <h3 className="text-xl font-bold">Error fetching TV shows</h3>
            <p>{error instanceof Error ? error.message : String(error)}</p>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {shows.map((show: MediaItem) => (
              <MediaCard
                key={show.id}
                media={show}
                mediaType="tv"
                onClick={setSelectedShow}
                onHoverStart={setSelectedShow}
                onHoverEnd={() => setSelectedShow(null)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
