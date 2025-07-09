import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import * as Sentry from "@sentry/react";

interface RegisterFormProps {
  onRegister?: () => void;
}

async function registerUser({
  username,
  password,
}: {
  username: string;
  password: string;
}): Promise<void> {
  const res = await fetch("http://localhost:3001/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Registration failed");
}

export default function RegisterForm({ onRegister }: RegisterFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);

  const mutation = useMutation<
    void,
    Error,
    { username: string; password: string }
  >({
    mutationFn: registerUser,
    onSuccess: () => {
      setSuccess(true);
      if (onRegister) onRegister();
    },
    onError: (error) => {
      console.error("Registration error:", error.message);
      Sentry.captureException(error);
      setSuccess(false);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        console.log("Submitting register form");
        mutation.mutate({ username, password });
      }}
    >
      <input
        id="register-username"
        name="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        id="register-password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="Password"
      />
      <button type="submit" disabled={mutation.status === "pending"}>
        Register
      </button>
      {success && (
        <div style={{ color: "green" }}>
          Registration succesful!You can now log in.
        </div>
      )}
      {mutation.status === "error" && (
        <div style={{ color: "red" }}>{mutation.error?.message}</div>
      )}
    </form>
  );
}
