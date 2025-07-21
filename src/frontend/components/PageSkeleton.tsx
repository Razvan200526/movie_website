import React from "react";
import Navbar from "./Navbar";

import type { Dispatch, SetStateAction } from "react";

interface PageSkeletonProps {
  children: React.ReactNode;
  onLogout?: () => void;
}

export default function PageSkeleton({
  children,
  onLogout,
}: PageSkeletonProps) {
  return (
    <div>
      <Navbar
        onLogout={onLogout ?? (() => { })}
      />
      <main className="container mx-auto p-4">{children}</main>
    </div>
  );
}
