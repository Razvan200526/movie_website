import { useNavigate } from "react-router-dom";

export interface MediaItem {
  id: number;
  title?: string; // For movies
  name?: string; // For TV shows
  poster_path: string;
  vote_average: number;
  release_date?: string; // For movies
  first_air_date?: string; // For TV shows
  overview: string;
  backdrop_path?: string;
}

export interface MediaCardProps {
  media: MediaItem;
  mediaType: "movie" | "tv";
  onHoverStart?: (media: MediaItem) => void;
  onHoverEnd?: () => void;
  onClick?: (media: MediaItem) => void;
}

export function MediaCard({
  media,
  mediaType,
  onClick: _onClick,
  onHoverStart,
  onHoverEnd,
}: MediaCardProps) {
  const posterUrl = media.poster_path
    ? `https://image.tmdb.org/t/p/w500${media.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Image";

  const displayTitle = mediaType === "movie" ? media.title : media.name;

  const releaseDate =
    mediaType === "movie" ? media.release_date : media.first_air_date;
  const releaseYear = releaseDate?.split("-")[0] || "Unknown";

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/${mediaType}/${media.id}`);
  };

  return (
    <div
      className="relative group cursor-pointer"
      onClick={handleClick}
      onMouseEnter={() => onHoverStart?.(media)}
      onMouseLeave={onHoverEnd}
    >
      <div className="w-full max-w-md aspect-[4/5] hover:border-white hover:border-4 rounded-md overflow-hidden transition-transform duration-300 group-hover:scale-105 group-hover:shadow-xl group-hover:z-10">
        <img
          src={posterUrl}
          alt={displayTitle}
          loading="lazy"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="text-white font-medium line-clamp-1">
              {displayTitle}
            </h3>
            <div className="flex items-center justify-between mt-1">
              <span className="text-green-500 text-sm font-medium">
                {Math.round(media.vote_average * 10)}% Match
              </span>
              <span className="text-gray-300 text-sm">{releaseYear}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
