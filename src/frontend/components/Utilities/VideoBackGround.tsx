import { useState, useEffect, useRef } from "react";
import { apiClient } from "../../services/apiClient";
import { VideoBackgroundProps } from "../../types";

export default function VideoBackGround({
  mediaType,
  movieId,
  children,
}: VideoBackgroundProps) {
  const [videoKey, setVideoKey] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLDivElement>(null);

  const videoCache = useRef<{ [id: string]: string | null }>({});

  useEffect(() => {
    if (!movieId) return;
    if (videoCache.current[movieId]) {
      setVideoKey(videoCache.current[movieId]);
      setHasError(false);
      return;
    }
    const fetchVideoKey = async () => {
      console.log(`Fetching video for ID : ${movieId}`);
      setHasError(false);

      try {
        const data = mediaType === "tv"
          ? await apiClient.getTVVideos(movieId)
          : await apiClient.getMovieVideos(movieId);
        const trailers = data.results.filter(
          (video) =>
            (video.type === "Trailer" ||
              video.type === "Teaser" ||
              video.type === "Opening Credits" ||
              video.type === "Clip") &&
            video.site === "YouTube"
        );
        console.log(trailers.length);
        if (trailers.length > 0) {
          setVideoKey(trailers[0].key);
          videoCache.current[movieId] = trailers[0].key;
        } else {
          setHasError(true);
          videoCache.current[movieId] = null;
        }
      } catch (error) {
        setHasError(true);
      }
    };
    fetchVideoKey();
  }, [movieId]);

  return (
    <div className="relative min-h-screen">
      <div
        ref={videoRef}
        className="absolute inset-0 bg-cover bg-center z-0 overflow-hidden"
      >
        {videoKey && (
          <div className="relative w-full h-full overflow-hidden">
            <iframe
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%]"
              src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&loop=1&playlist=${videoKey}&modestbranding=1`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent z-10"></div>
          </div>
        )}

        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/70 text-white">
            <span>Trailer not available.</span>
          </div>
        )}
      </div>
      <div className="relative z-20">{children}</div>
    </div>
  );
}
