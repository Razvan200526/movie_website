export const API_CONFIG = {
  BASE_URL: import.meta.env.DEV ? "http://localhost:5001" : "",
  ENDPOINTS: {
    AUTH: {
      LOGIN: "/api/login",
      REGISTER: "/api/register",
      PROFILE: "/api/profile",
    },
    TMDB: {
      DISCOVER_MOVIES: "/api/tmdb/discover",
      DISCOVER_TV: "/api/tmdb/discover/tv",
      MOVIE_DETAILS: (id: number) => `/api/tmdb/movie/${id}`,
      TV_DETAILS: (id: number) => `/api/tmdb/tv/${id}`,
      MOVIE_VIDEOS: (id: number) => `/api/tmdb/movie/${id}/videos`,
      TV_VIDEOS: (id: number) => `/api/tmdb/tv/${id}/videos`,
      SEARCH: "/api/tmdb/search",
    },
    LIST: {
      GET: "/api/list",
      ADD: "/api/list/add",
      REMOVE: "/api/list/remove",
    },
    GENRES:"/api/tmdb/genres",
    MOVIES_BY_GENRE: (genreId : number) => `/api/tmdb/genre/${genreId}/movies`,
  },
};
