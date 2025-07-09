import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

interface AuthPageProps {
  onLogin: (token: string) => void;
}

export default function AuthPage({ onLogin }: AuthPageProps) {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: "2rem" }}>
      {showRegister ? (
        <>
          <h2>Register</h2>
          <RegisterForm onRegister={() => setShowRegister(false)} />
          <p>
            Already have an account?{" "}
            <button type="button" onClick={() => setShowRegister(false)}>
              Login
            </button>
          </p>
        </>
      ) : (
        <>
          <h2>Login</h2>
          <LoginForm onLogin={onLogin} />
          <p>
            Don't have an account?{" "}
            <button type="button" onClick={() => setShowRegister(true)}>
              Register
            </button>
          </p>
        </>
      )}
    </div>
  );
}
