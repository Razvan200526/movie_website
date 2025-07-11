import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import * as Sentry from "@sentry/react";

interface RegisterFormProps {
  onRegister: () => void;
}

async function registerUser({
  username,
  email,
  password,
}: {
  username: string;
  email: string;
  password: string;
}): Promise<void> {
  console.log("Sending registration request to backend");
  try {
    const res = await fetch("http://localhost:3001/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await res.json();
    console.log("Registration response:", data);
    if (!res.ok) throw new Error(data.error || "Registration failed");
  } catch (error) {
    console.error("Registration fetch error:", error);
    throw error;
  }
}

export default function RegisterForm({ onRegister }: RegisterFormProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const mutation = useMutation<
    void,
    Error,
    { username: string; email: string; password: string }
  >({
    mutationFn: registerUser,
    onSuccess: () => {
      console.log("Registration successful");
      onRegister();
    },
    onError: (error) => {
      console.error("Registration error:", error.message);
      Sentry.captureException(error);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        console.log("Submitting registration form:", {
          username,
          email,
          password,
        });
        mutation.mutate({ username, email, password });
      }}
      className="space-y-4"
    >
      <div className="space-y-1">
        <input
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="w-full px-4 py-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
          required
        />
      </div>

      <div className="space-y-1">
        <input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
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
        {mutation.status === "pending" ? "Signing Up..." : "Sign Up"}
      </button>

      {mutation.status === "error" && (
        <div className="text-red-500 text-sm p-2 bg-red-500/10 rounded">
          {mutation.error?.message}
        </div>
      )}
    </form>
  );
}
