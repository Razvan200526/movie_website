import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AuthPage from "./components/Auth/AuthPage";
import PrivateRoute from "./components/Auth/PrivateRoute";
import MainApp from "./components/MainApp";
import TVShowsPage from "./components/TVShowsPage";
import MediaPage from "./components/MediaPage";

function AppContent() {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token"),
  );

  useEffect(() => {
    if (!token) {
      navigate("/auth");
    }
  }, [token, navigate]);
  function handleLogin(newToken: string) {
    console.log("handleLogin called with token:", newToken);

    if (!newToken || typeof newToken !== "string" || newToken.length < 5) {
      console.error("Invalid token received:", newToken);
      return;
    }

    setToken(newToken);
    localStorage.setItem("token", newToken);
    console.log("Token stored, redirecting now");

    navigate("/");
  }

  function handleLogout() {
    setToken(null);
    localStorage.removeItem("token");
    navigate("/auth");
  }

  return (
    <Routes>
      <Route path="/auth" element={<AuthPage onLogin={handleLogin} />} />
      <Route
        path="/*"
        element={
          <PrivateRoute token={token}>
            <MainApp onLogout={handleLogout} token={token} />
          </PrivateRoute>
        }
      />
      <Route path="/movie/:id" element={<MediaPage />} />
      <Route path="/tv/:id" element={<MediaPage />} />
      <Route
        path="/tvshows"
        element={<TVShowsPage onLogout={handleLogout} token={token} />}
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
