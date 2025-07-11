const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

export interface VideoResult {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export async function fetchMovieTrailers(
  movieId: number,
): Promise<VideoResult | null> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/movie/${movieId}/videos`,
      API_OPTIONS,
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const trailers = data.results.filter(
      (video: any) =>
        (video.type === "Trailer" || video.type === "Teaser") &&
        video.site === "YouTube",
    );

    if (trailers.length > 0) {
      return trailers[0];
    } else {
      throw new Error("No official trailer found");
    }
  } catch (error: any) {
    console.error("Error fetching movie trailers:", error);
    return null;
  }
}
