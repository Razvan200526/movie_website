import * as Sentry from "@sentry/react";

interface Movie {
  id: number;
  title: string;
  vote_average: number;
  poster_path: string;
  release_date: string;
  original_language: string;
}

interface MovieCardProps {
  movie: Movie;
}

export const MovieCard = ({ movie }: MovieCardProps) => {
  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    // Log image loading errors to Sentry
    Sentry.captureException(new Error("Movie poster failed to load"), {
      tags: {
        section: "movie_card",
        error_type: "image_load",
      },
      extra: {
        movieId: movie.id,
        movieTitle: movie.title,
        posterPath: movie.poster_path,
        imageUrl: (event.target as HTMLImageElement).src,
      },
    });
  };

  return (
    <div className="movie-card">
      <img
        src={
          movie.poster_path
            ? `https://image.tmdb.org/t/p/w300/${movie.poster_path}`
            : `no-movie.png`
        }
        alt={movie.title}
        onError={handleImageError}
      />

      <div className="mt-4">
        <h3>{movie.title}</h3>

        <div className="content">
          <div className="rating">
            <img src="/star.svg" alt="Star Icon" />
            <p>{movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}</p>
          </div>
          <span>·</span>
          <p className="language">
            {movie.original_language ? movie.original_language : "N/A"}
          </p>
          <span>·</span>
          <p className="year">
            {movie.release_date ? movie.release_date.split("-")[0] : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};
