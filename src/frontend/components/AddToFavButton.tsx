import { MediaItem } from "../types/index";
import { useState } from "react";
import { apiClient } from "../services/api";

export default function AddToFavButton({
  media: _media,
}: {
  media: MediaItem;
}) {
  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAddToFav = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You need to be logged in to add to favorites.");
        return;
      }
      const mediaItem = {
        ..._media,
        media_type: _media.media_type || "movie",
      };

      await apiClient.addToUserList(token, mediaItem);
      setIsFav(true);
    } catch (error) {
      console.error("Failed to add to favorites:", error);
      alert("Failed to add to favorites. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleAddToFav}
      disabled={loading || isFav}
      className={`p-2 rounded ${isFav ? "bg-red-500" : "bg-gray-500"}`}
    >
      {isFav ? "Added to Favorites" : "Add to Favorites"}
    </button>
  );
}
