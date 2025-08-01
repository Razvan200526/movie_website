import { useState } from "react";
import { useQuery, useQueries } from "@tanstack/react-query";
import { apiClient } from "../../services/apiClient";
import { MediaItem } from "../../types";
import PageSkeleton from "../Layout/PageSkeleton";
import MovieRow from "../Utilities/MovieRow";
import VideoBackGround from "../Utilities/VideoBackGround";
import { TrailerModal } from "../Utilities/TrailerModal";

interface TVShowsPageProps {
  token: string | null;
  onLogout: () => void;
}
export default function TVShowsPage({ token: _token, onLogout }: TVShowsPageProps) {

  const [selectedShow, setSelectedShow] = useState<MediaItem | null>(null);
  const { data: genresData, isLoading: genresLoading } = useQuery({
    queryKey: ["tv-genres"],
    queryFn: () => apiClient.getTVGenres()
  })
  const genres = genresData?.genres || [];

  const genreShowQueries = useQueries({
    queries: genres.map((genre) => ({
      queryKey: ["tv-shows", genre.id],
      queryFn: () => apiClient.getTvShowsByGenre(genre.id),
      enabled: !!genres.length,
    }))
  })
  const firstShow = genreShowQueries[0]?.data?.results?.[0] || null;
  console.log("firstShow:", firstShow);
  console.log("firstShow.id:", firstShow?.id);
  return (
    <PageSkeleton
      onLogout={onLogout}
    >
      <div className="relative h-[70vh] w-full bg-gradient-to-t from-black to-transparent overflow-hidden">
        <VideoBackGround
          mediaType="tv"
          movieId={firstShow ? firstShow.id : 0}
          fallbackImage={firstShow ?
            firstShow?.backdrop_path || firstShow?.poster_path || "" : ""}
        />
      </div>
      <div className="px-4 md:px-8 py-8 -mt-10 relative z-20">
        {genresLoading && <div>Loading genres...</div>}
        {genres.map((genre, idx) => (
          <MovieRow
            key={genre.id}
            title={genre.name}
            movies={genreShowQueries[idx].data?.results || []}
            mediaType="tv"
          />
        ))}
      </div>
      {selectedShow && (
        <TrailerModal
          movie={selectedShow}
          onClose={() => setSelectedShow(null)}
        />
      )}
    </PageSkeleton>
  )
}
