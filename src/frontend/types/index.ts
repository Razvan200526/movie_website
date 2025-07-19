import { Dispatch, SetStateAction } from "react";

export interface MediaItem {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  backdrop_path?: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  overview: string;
  genre_ids?: number[];
  media_type?: "movie" | "tv";
}

// API Response Types
export interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

// Auth Types
export interface User {
  id: number;
  username: string;
}

export interface AuthResponse {
  token: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email?: string;
  password: string;
}

// Video Types
export interface VideoResult {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

// Component Props Types
export interface NavbarProps {
  onLogout: () => void;
  searchTerm?: string;
  setSearchTerm?: Dispatch<SetStateAction<string>>;
  showSearch?: boolean;
}

export interface MediaCardProps {
  media: MediaItem;
  mediaType: "movie" | "tv";
  onClick?: (media: MediaItem) => void;
  onHoverStart?: (media: MediaItem) => void;
  onHoverEnd?: () => void;
}
