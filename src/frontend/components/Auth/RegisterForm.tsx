import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import * as Sentry from "@sentry/react";
import { apiClient } from "../../services/apiClient";
import { RegisterRequest } from "../../types";

interface RegisterFormProps {
  onRegister: () => void;
}

export default function RegisterForm({ onRegister }: RegisterFormProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const registerMutation = useMutation({
    mutationFn: (userData: RegisterRequest) => apiClient.register(userData),
    onSuccess: () => {
      console.log("Registration successful");
      onRegister();
    },
    onError: (error) => {
      console.error("Registration failed:", error);
      Sentry.captureException(error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !email.trim() || !password.trim()) {
      console.log("All fields are required");
      return;
    }

    console.log("Attempting registration for user:", username);
    registerMutation.mutate({ username, email, password });
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
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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

      {registerMutation.isError && (
        <div className="text-red-400 text-sm">
          {registerMutation.error instanceof Error
            ? registerMutation.error.message
            : "Registration failed"}
        </div>
      )}

      <button
        type="submit"
        disabled={registerMutation.isPending}
        className="w-full bg-red-600 text-white p-3 rounded-md hover:bg-red-700 disabled:bg-gray-600 font-medium"
      >
        {registerMutation.isPending ? "Signing Up..." : "Sign Up"}
      </button>
    </form>
  );
}
