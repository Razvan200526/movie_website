import { ReactNode, Dispatch, SetStateAction } from "react";
import Navbar from "./Navbar";

interface LayoutProps {
  children: ReactNode;
  onLogout: () => void;
  searchTerm?: string;
  setSearchTerm?: Dispatch<SetStateAction<string>>;
  showSearch?: boolean;
  showNavbar?: boolean;
}

export default function Layout({
  children,
  onLogout,
  searchTerm,
  setSearchTerm,
  showSearch = true,
  showNavbar = true,
}: LayoutProps) {
  return (
    <div className="min-h-screen bg-black text-white">
      {showNavbar && (
        <Navbar
          onLogout={onLogout}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          showSearch={showSearch}
        />
      )}

      <main>{children}</main>
    </div>
  );
}
