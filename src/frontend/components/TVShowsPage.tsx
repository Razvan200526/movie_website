import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MediaCard } from "./MediaCard";
import VideoBackground from "./VideoBackGround";
import Layout from "./Layout";
import { apiClient } from "../services/api";
import { MediaItem } from "../types";

interface TVShowsPageProps {
  token: string | null;
  onLogout: () => void;
}

export default function TVShowsPage({
  token: _token,
  onLogout,
}: TVShowsPageProps) {
  const [_selectedShow, setSelectedShow] = useState<MediaItem | null>(null);

  const {
    data: showsResponse,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["tv", "popular"],
    queryFn: () => apiClient.getPopularTVShows(),
    refetchOnWindowFocus: false,
  });

  const shows = showsResponse?.results || [];

  return (
    <Layout onLogout={onLogout} showSearch={false}>
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
    </Layout>
  );
}
