import { useState, useEffect } from "react";
import { TrailerModalProps } from "../../types";
import { apiClient } from "../../services/apiClient";


export const TrailerModal: React.FC<TrailerModalProps> = ({
  movie,
  onClose,
}) => {
  const [videoKey, setVideoKey] = useState<string | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);

    const fetchTrailer = async () => {
      try {
        const data = await apiClient.getMovieVideos(movie.id);
        const trailer = data.results.find(
          (vid) => vid.type === "Trailer" && vid.site === "YouTube",
        );
        setVideoKey(trailer ? trailer.key : null);
      } catch (error) {
        console.error("Error fetching trailer:", error);
        setVideoKey(null);
      }
    };

    fetchTrailer();
  }, [movie]);

  const modalClasses = `transition-all duration-300 transform ${show ? "opacity-100 scale-100" : "opacity-0 scale-90"
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
            allowFullScreen={false}
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-white text-xl bg-gray-800 rounded-lg">
            Trailer not available.
          </div>
        )}
      </div>
    </div>
  );
};
