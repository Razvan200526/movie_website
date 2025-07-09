import React from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  token: string | null;
  children: React.ReactNode;
}

export default function PrivateRoute({ token, children }: PrivateRouteProps) {
  console.log("PrivateRoute - token exists:", !!token);
  if (!token) {
    console.log("PrivateRoute - redirecting to /auth");
    return <Navigate to="/auth" replace />;
  }
  console.log("PrivateRoute - rendering protected content");
  return <>{children}</>;
}
