interface MovieProps {
  movie: {
    id: number;
    title: string;
    poster_path: string;
    vote_average: number;
    release_date: string;
    overview: string;
  };
}

export function MovieCard({ movie }: MovieProps) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Image";

  const releaseYear = movie.release_date?.split("-")[0] || "Unknown";

  return (
    <div className="relative group">
      <div className="aspect-[2/3] rounded-md overflow-hidden transition-transform duration-300 group-hover:scale-105 group-hover:shadow-xl group-hover:z-10">
        <img
          src={posterUrl}
          alt={movie.title}
          loading="lazy"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="text-white font-medium line-clamp-1">
              {movie.title}
            </h3>
            <div className="flex items-center justify-between mt-1">
              <span className="text-green-500 text-sm font-medium">
                {Math.round(movie.vote_average * 10)}% Match
              </span>
              <span className="text-gray-300 text-sm">{releaseYear}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
