import { useState, useEffect, useRef } from "react";

interface VideoBackgroundProps {
  movieId: number;
  fallbackImage: string;
}

export default function VideoBackground({
  movieId,
  fallbackImage,
}: VideoBackgroundProps) {
  const [videoKey, setVideoKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [_hasError, setHasError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const fetchVideoKey = async () => {
      if (isMobile || !movieId) return; // Don't fetch on mobile

      try {
        setIsLoading(true);
        setHasError(false);

        const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

        console.log("Fetching video for movie ID:", movieId);

        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}/videos`,
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
          console.error(
            "TMDb API error:",
            response.status,
            response.statusText,
          );
          throw new Error(`Failed to fetch video data: ${response.status}`);
        }

        const data = await response.json();

        const trailers = data.results.filter(
          (video: any) =>
            (video.type === "Trailer" || video.type === "Teaser") &&
            video.site === "YouTube",
        );

        if (trailers.length > 0) {
          console.log("Found trailer:", trailers[0].key);
          setVideoKey(trailers[0].key);
        } else {
          console.log("No trailers found");
          setHasError(true);
        }
      } catch (error) {
        console.error("Error fetching video:", error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideoKey();
  }, [movieId, isMobile]);

  return (
    <div
      ref={videoRef}
      className="absolute inset-0 bg-cover bg-center z-0 overflow-hidden"
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        </div>
      )}

      {videoKey && !isMobile ? (
        <div className="relative w-full h-full overflow-hidden">
          <iframe
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%]"
            src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&loop=1&playlist=${videoKey}&modestbranding=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent z-10"></div>
        </div>
      ) : (
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${fallbackImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent z-10"></div>
        </div>
      )}
    </div>
  );
}
