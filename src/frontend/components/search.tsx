import { SetStateAction } from "react";
import { Dispatch } from "react";
interface SearchProps {
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
}

export default function Search({ searchTerm, setSearchTerm }: SearchProps) {
  return (
    <div className="relative">
      <button className="p-2 text-gray-400 hover:text-white focus:outline-none">
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>

      <input
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="absolute right-0 top-0 w-0 focus:w-40 transition-all duration-300 ease-in-out bg-black/50 border border-transparent focus:border-gray-600 text-white rounded-sm py-1 px-2 focus:outline-none focus:ring-1 focus:ring-gray-600 placeholder-gray-500"
      />
    </div>
  );
}
