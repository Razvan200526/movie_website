import { useNavigate } from "react-router-dom";
import { MediaItem, MediaCardProps } from "../types";
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
    // Use media.media_id for user-list items, fallback to media.id for TMDB items
    const tmdbId = media.media_id ?? media.id;
    navigate(`/${mediaType}/${tmdbId}`);
  }

  return (
    console.log("[MediaCard] Rendering media:", media),
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

export type { MediaItem, MediaCardProps };
