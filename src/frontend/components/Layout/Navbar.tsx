import { Link, useLocation } from "react-router-dom";
import { LogoutButton } from "../Auth/Logout";
import { NavbarProps } from "../../types";

export default function Navbar({
  onLogout,
}: NavbarProps) {
  const location = useLocation();

  const isActivePath = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const getLinkClasses = (path: string) => {
    const baseClasses = "font-medium hover:text-gray-300 transition-colors";
    return isActivePath(path)
      ? `${baseClasses} text-white`
      : `${baseClasses} text-gray-300 hover:text-white`;
  };

  return (
    <header className="bg-black/95 px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-md">
      <div className="flex items-center">
        <Link to="/" className="mr-8">
          <img
            src="/netflix-title.svg"
            alt="Netflix"
            className="h-7"
            style={{ display: "block" }}
          />
        </Link>

        <nav className="hidden md:flex space-x-4">
          <Link to="/" className={getLinkClasses("/")}>
            Home
          </Link>
          <Link to="/tvshows" className={getLinkClasses("/tvshows")}>
            TV Shows
          </Link>
          <Link to="/movies" className={getLinkClasses("/movies")}>
            Movies
          </Link>
          <Link to="/mylist" className={getLinkClasses("/mylist")}>
            My List
          </Link>
        </nav>
      </div>

      <div className="flex items-center space-x-4">
        <LogoutButton onLogout={onLogout} />
      </div>
    </header>
  );
}
