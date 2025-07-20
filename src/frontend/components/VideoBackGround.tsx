import { useState, useEffect, useRef } from "react";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
interface VideoBackgroundProps {
  movieId: number;
  fallbackImage: string | null;
  children?: React.ReactNode;
}

export default function VideoBackGround({
  movieId,
  fallbackImage,
  children,
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
      if (isMobile || !movieId) return;

      try {
        setIsLoading(true);
        setHasError(false);

        let isTV = false;
        if (typeof window !== "undefined") {
          isTV = /tv(\/|$|shows?)/i.test(window.location.pathname);
        }

        const endpoint = isTV
          ? `/api/tmdb/tv/${movieId}/videos`
          : `/api/tmdb/movie/${movieId}/videos`;
        console.log(endpoint);
        console.log(
          "Fetching video for",
          isTV ? "TV show" : "movie",
          "ID:",
          movieId,
        );

        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${API_KEY}`,
          },
        });

        if (!response.ok) {
          console.log(endpoint);
          console.error(
            "Backend API error:",
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
    <div className="relative min-h-screen">
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

      {/* Render children content on top of the video background */}
      <div className="relative z-20">{children}</div>
    </div>
  );
}
