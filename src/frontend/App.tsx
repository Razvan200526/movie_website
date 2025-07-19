import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import AuthPage from "./components/Auth/AuthPage";
import PrivateRoute from "./components/Auth/PrivateRoute";
import MainApp from "./components/MainApp";
import TVShowsPage from "./components/TVShowsPage";
import MediaPage from "./components/MediaPage";
import { ErrorBoundary } from "./components/ErrorBoundary";
import MyList from "./components/MyList";
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
        path="/mylist"
        element={
          <PrivateRoute token={token}>
            <MyList />
          </PrivateRoute>
        }
      />
      <Route
        path="/movie/:id"
        element={
          <PrivateRoute token={token}>
            <MediaPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/tv/:id"
        element={
          <PrivateRoute token={token}>
            <MediaPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/tvshows"
        element={
          <PrivateRoute token={token}>
            <TVShowsPage onLogout={handleLogout} token={token} />
          </PrivateRoute>
        }
      />

      <Route
        path="/"
        element={
          <PrivateRoute token={token}>
            <MainApp onLogout={handleLogout} token={token} />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ErrorBoundary>
  );
}
