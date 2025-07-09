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
    >
      <input
        id="username"
        name="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        id="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="Password"
      />
      <button type="submit" disabled={mutation.status === "pending"}>
        Login
      </button>
      {mutation.status === "error" && (
        <div style={{ color: "red" }}>{mutation.error?.message}</div>
      )}
    </form>
  );
}
