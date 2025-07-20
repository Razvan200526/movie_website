import { API_CONFIG } from "../config/api";
import {
  TMDBResponse,
  MediaItem,
  VideoResult,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "../types";
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_CONFIG.BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit,
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterRequest): Promise<{ user: any }> {
    return this.request<{ user: any }>(API_CONFIG.ENDPOINTS.AUTH.REGISTER, {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async getPopularMovies(): Promise<TMDBResponse<MediaItem>> {
    return this.request<TMDBResponse<MediaItem>>(
      API_CONFIG.ENDPOINTS.TMDB.DISCOVER_MOVIES,
    );
  }

  async getPopularTVShows(): Promise<TMDBResponse<MediaItem>> {
    return this.request<TMDBResponse<MediaItem>>(
      API_CONFIG.ENDPOINTS.TMDB.DISCOVER_TV,
    );
  }

  async getMovieDetails(id: number): Promise<MediaItem> {
    return this.request<MediaItem>(API_CONFIG.ENDPOINTS.TMDB.MOVIE_DETAILS(id));
  }

  async getTVDetails(id: number): Promise<MediaItem> {
    return this.request<MediaItem>(API_CONFIG.ENDPOINTS.TMDB.TV_DETAILS(id));
  }

  async getMovieVideos(id: number): Promise<{ results: VideoResult[] }> {
    return this.request<{ results: VideoResult[] }>(
      API_CONFIG.ENDPOINTS.TMDB.MOVIE_VIDEOS(id),
    );
  }

  async getTVVideos(id: number): Promise<{ results: VideoResult[] }> {
    return this.request<{ results: VideoResult[] }>(
      API_CONFIG.ENDPOINTS.TMDB.TV_VIDEOS(id),
    );
  }

  async searchMovies(query: string): Promise<TMDBResponse<MediaItem>> {
    return this.request<TMDBResponse<MediaItem>>(
      `${API_CONFIG.ENDPOINTS.TMDB.SEARCH}?query=${encodeURIComponent(query)}`,
    );
  }
  async getUserList(token: string) {
    // Debug: log the token value before making the request
    console.log("[ApiClient.getUserList] Using token:", token);
    return this.request<TMDBResponse<MediaItem>>(
      API_CONFIG.ENDPOINTS.LIST.GET,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      },
    );
  }
  async addToUserList(token: string, mediaItem: MediaItem) {
    return this.request<TMDBResponse<MediaItem>>(
      API_CONFIG.ENDPOINTS.LIST.ADD,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(mediaItem),
      },
    );
  }

  async removeFromUserList(token: string, mediaId: number) {
    return this.request<TMDBResponse<MediaItem>>(
      `${API_CONFIG.ENDPOINTS.LIST.REMOVE}/${mediaId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      },
    );
  }
}

export const apiClient = new ApiClient();
