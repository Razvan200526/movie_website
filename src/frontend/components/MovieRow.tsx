import { MediaCard } from "./MediaCard"
import { MediaItem } from "../types"

interface MovieRowProps {
  title?: string;
  movies: MediaItem[];
  mediaType: string;
}
export default function MovieRow({ title, movies, mediaType }: MovieRowProps) {
  return (
    <div className="mb-8">
      {title && <h2 className="text-xl font-bold mb-2 px-2">{title}</h2>}
      <div className="flex overflow-x-auto space-x-4 px-2 pb-2 scrollbar-thin scrollbar-thumb-gray-70 scrollbar-track-gray-900">
        {movies.map((movie) => (
          <div key={movie.id} className="flex-shrink-0 w-40">
            <MediaCard media={movie} mediaType={mediaType} />
          </div>
        ))}
      </div>
    </div>
  )
}
