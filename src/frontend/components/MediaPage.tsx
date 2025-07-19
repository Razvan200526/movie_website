import { useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import VideoBackground from "./VideoBackGround";
import Loading from "./Loading";
import { Link } from "react-router-dom";
import { apiClient } from "../services/api";
import { MediaItem } from "../types";

export default function MediaPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [media, setMedia] = useState<MediaItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInList, setIsInList] = useState<boolean>(false);
  const [isUpdatingList, setIsUpdatingList] = useState<boolean>(false);

  const mediaType = location.pathname.startsWith("/tv") ? "tv" : "movie";

  useEffect(() => {
    async function fetchMedia() {
      if (!id) return;

      setIsLoading(true);
      setError(null);

      try {

        const data =
          mediaType === "tv"
            ? await apiClient.getTVDetails(Number(id))
            : await apiClient.getMovieDetails(Number(id));

        setMedia(data);
      } catch (err) {
        console.error(`Error fetching ${mediaType}:`, err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    }

    fetchMedia();
  }, [id, mediaType]);

  useEffect(() => {
    const checkListStatus = async () => {
      const token = localStorage.getItem("token");
      if (!token || !media) {
        return;
      }
      try {
        const userList = await apiClient.getUserList(token);
        const isInUserList = userList.results.some(
          (item: any) => item.media_id === media.id,
        );
        setIsInList(isInUserList);
      } catch (error: any) {
        console.error("Failed to check list status: ", error);
      }
    };
    checkListStatus();
  }, [media]);

  const handleListToggle = async () => {
    const token = localStorage.getItem("token");
    if (!token || !media) return;

    setIsUpdatingList(true);
    try {
      if (isInList) {
        await apiClient.removeFromUserList(token, media.id);
        setIsInList(false);
      } else {
        const mediaItem = {
          ...media,
          media_type: mediaType as "tv" | "movie",
        };
        await apiClient.addToUserList(token, mediaItem);
        setIsInList(true);
      }
    } catch (error: any) {
      console.error("Failed to update list:", error);
      setError(
        `Failed to ${isInList ? "remove from" : "add to"} your list. Please try again.`,
      );
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsUpdatingList(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error && !media) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="text-red-400 mb-4">{error}</p>
          <Link to="/" className="text-blue-400 hover:text-blue-300">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!media) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Not Found</h2>
          <p className="text-gray-400 mb-4">
            {mediaType === "tv" ? "TV Show" : "Movie"} not found
          </p>
          <Link to="/" className="text-blue-400 hover:text-blue-300">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const displayTitle = mediaType === "tv" ? media.name : media.title;
  const displayDate =
    mediaType === "tv" ? media.first_air_date : media.release_date;

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="bg-black/95 px-4 py-3 sticky top-0 z-50 shadow-md">
        <Link
          to="/"
          className="text-white hover:text-gray-300 flex items-center"
        >
          <span className="mr-2">←</span>
          Back to Home
        </Link>
      </header>

      {/* Show error message if there's one */}
      {error && media && (
        <div className="bg-red-600/90 text-white p-3 text-center">{error}</div>
      )}

      <VideoBackground
        movieId={media.id}
        fallbackImage={`https://image.tmdb.org/t/p/original${media.backdrop_path}`}
      >
        <div className="p-8 pt-20">
          <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
            <div className="flex-shrink-0">
              <img
                src={`https://image.tmdb.org/t/p/w500${media.poster_path}`}
                alt={displayTitle}
                className="rounded-lg w-64 shadow-lg"
              />
            </div>

            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {displayTitle}
              </h1>
              <p className="text-lg md:text-xl mb-6 text-gray-300 leading-relaxed">
                {media.overview}
              </p>

              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="text-gray-400 w-32">
                    {mediaType === "tv" ? "First Air Date:" : "Release Date:"}
                  </span>
                  <span className="text-white">{displayDate || "N/A"}</span>
                </div>

                <div className="flex items-center">
                  <span className="text-gray-400 w-32">Rating:</span>
                  <span className="text-green-400 font-medium">
                    {media.vote_average
                      ? `${Math.round(media.vote_average * 10)}/100`
                      : "N/A"}
                  </span>
                </div>

                <div className="flex items-center">
                  <span className="text-gray-400 w-32">Type:</span>
                  <span className="text-white capitalize">
                    {mediaType === "tv" ? "TV Show" : "Movie"}
                  </span>
                </div>
              </div>
              <div className="flex space-x-4 mt-8">
                <button className="bg-white text-black px-6 py-3 rounded-md font-bold flex items-center hover:bg-gray-200 transition-colors">
                  <span className="mr-2">▶</span> Play
                </button>
                <button
                  onClick={handleListToggle}
                  disabled={isUpdatingList}
                  className={`px-6 py-3 rounded-md font-bold transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
                    isInList
                      ? "bg-gray-800 text-white border border-gray-600 hover:bg-gray-700"
                      : "bg-gray-600/70 text-white hover:bg-gray-600"
                  }`}
                >
                  {isUpdatingList ? (
                    <span className="flex items-center">
                      <span className="animate-spin mr-2">⟳</span>
                      {isInList ? "Removing..." : "Adding..."}
                    </span>
                  ) : (
                    <>{isInList ? "✓ My List" : "+ My List"}</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </VideoBackground>
    </div>
  );
}
