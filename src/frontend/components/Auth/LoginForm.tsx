import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import * as Sentry from "@sentry/react";
import { apiClient } from "../../services/api";
import { LoginRequest } from "../../types";

interface LoginFormProps {
  onLogin: (token: string) => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequest) => apiClient.login(credentials),
    onSuccess: (data) => {
      console.log("Login successful, received token");
      onLogin(data.token);
    },
    onError: (error) => {
      console.error("Login failed:", error);
      Sentry.captureException(error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      console.log("Username and password are required");
      return;
    }

    console.log("Attempting login for user:", username);
    loginMutation.mutate({ username, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 bg-gray-700 text-white rounded-md border border-gray-600 focus:border-red-500 focus:outline-none"
          required
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 bg-gray-700 text-white rounded-md border border-gray-600 focus:border-red-500 focus:outline-none"
          required
        />
      </div>
      {loginMutation.isError && (
        <div className="text-red-400 text-sm">
          {loginMutation.error instanceof Error
            ? loginMutation.error.message
            : "Login failed"}
        </div>
      )}
      <button
        type="submit"
        disabled={loginMutation.isPending}
        className="w-full bg-red-600 text-white p-3 rounded-md hover:bg-red-700 disabled:bg-gray-600 font-medium"
      >
        {loginMutation.isPending ? "Signing In..." : "Sign In"}
      </button>
    </form>
  );
}
