import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import * as Sentry from "@sentry/react";

interface LoginFormProps {
  onLogin: (token: string) => void;
}

async function loginUser({
  username,
  password,
}: {
  username: string;
  password: string;
}): Promise<string> {
  console.log("Sending login request to backend");
  try {
    const res = await fetch("http://localhost:3001/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    console.log("Login response:", data);
    if (!res.ok) throw new Error(data.error || "Login failed");
    return data.token as string;
  } catch (error) {
    console.error("Login fetch error:", error);
    throw error;
  }
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const mutation = useMutation<
    string,
    Error,
    { username: string; password: string }
  >({
    mutationFn: loginUser,
    onSuccess: (token) => {
      console.log("Login successful, got token:", token);
      onLogin(token);
    },
    onError: (error) => {
      console.error("Login error:", error.message);
      Sentry.captureException(error);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        console.log("Submitting login form:", { username, password });
        mutation.mutate({ username, password });
      }}
      className="space-y-4"
    >
      <div className="space-y-1">
        <input
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Email or phone number"
          className="w-full px-4 py-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
          required
        />
      </div>

      <div className="space-y-1">
        <input
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          className="w-full px-4 py-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
          required
        />
      </div>

      <button
        type="submit"
        disabled={mutation.status === "pending"}
        className="w-full bg-red-600 text-white py-3 rounded-md hover:bg-red-700 transition duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {mutation.status === "pending" ? "Signing In..." : "Sign In"}
      </button>

      {mutation.status === "error" && (
        <div className="text-red-500 text-sm p-2 bg-red-500/10 rounded">
          {mutation.error?.message}
        </div>
      )}

      <div className="flex items-center justify-between text-sm text-gray-400">
        <div className="flex items-center">
          <input type="checkbox" id="remember" className="mr-1 text-red-600" />
          <label htmlFor="remember">Remember me</label>
        </div>
        <a href="#" className="hover:underline">
          Need help?
        </a>
      </div>
    </form>
  );
}
