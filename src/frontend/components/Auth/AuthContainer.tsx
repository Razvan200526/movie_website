import { useState, useEffect } from "react";
import LoginForm from "./LoginForm";
import { LogoutButton } from "./Logout";

export default function AuthContainer() {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isAuthentificated, setIsAuthentificated] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthToken(token);
      setIsAuthentificated(true);
    }
  }, []);

  const handleLogin = (token: string) => {
    localStorage.setItem("token", token);
    setAuthToken(token);
    setIsAuthentificated(true);

    console.log("User logged in, token set:", token);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuthToken(null);
    setIsAuthentificated(false);

    console.log("User logged out, token removed");
  };

  return isAuthentificated ? (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div>Welcome to Webflix!</div>
      <LogoutButton onLogout={handleLogout} />
    </div>
  ) : (
    <LoginForm onLogin={handleLogin} />
  );
}
