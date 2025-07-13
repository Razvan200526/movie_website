import React, { useState, useEffect } from "react";
import { MovieType } from "./MainApp";

interface TrailerModalProps {
  movie: MovieType;
  onClose: () => void;
}

export const TrailerModal: React.FC<TrailerModalProps> = ({
  movie,
  onClose,
}) => {
  const [videoKey, setVideoKey] = useState<string | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true); // Trigger animation on mount
    const fetchTrailer = async () => {
      const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movie.id}/videos`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      );
      if (!response.ok) {
        throw new Error("Error fetching the trailer");
      }
      const data = await response.json();
      const trailer = data.results.find(
        (vid: any) => vid.type === "Trailer" && vid.site === "YouTube",
      );
      setVideoKey(trailer ? trailer.key : null);
    };
    fetchTrailer();
  }, [movie.id]);

  // Animation classes
  const modalClasses = `transition-all duration-300 transform ${
    show ? "opacity-100 scale-100" : "opacity-0 scale-90"
  }`;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-2xl aspect-video ${modalClasses}`}
        onClick={(e) => e.stopPropagation()}
      >
        {videoKey ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoKey}?autoplay=1`}
            title="Trailer"
            className="w-full h-full rounded-lg"
            allowFullScreen
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-white text-xl">
            Trailer not available.
          </div>
        )}
      </div>
    </div>
  );
};
