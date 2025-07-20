import React from "react";
import Navbar from "./Navbar";

import type { Dispatch, SetStateAction } from "react";

interface PageSkeletonProps {
  children: React.ReactNode;
  searchTerm?: string;
  setSearchTerm?: Dispatch<SetStateAction<string>>;
  onLogout?: () => void;
  showSearch?: boolean;
}

export default function PageSkeleton({
  children,
  searchTerm = "",
  setSearchTerm,
  onLogout,
  showSearch = true,
} : PageSkeletonProps) {
  return (
    <div>
      <Navbar
        setSearchTerm={setSearchTerm}
        searchTerm={searchTerm}
        onLogout={onLogout ?? (() => {})}
        showSearch={showSearch}
      />
      <main className="container mx-auto p-4">{children}</main>
    </div>
  );
}
