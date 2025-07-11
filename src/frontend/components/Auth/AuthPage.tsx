import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

interface AuthPageProps {
  onLogin: (token: string) => void;
}

export default function AuthPage({ onLogin }: AuthPageProps) {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div className="min-h-screen bg-black bg-opacity-90 flex flex-col items-center justify-center px-4">
      {/* Netflix Logo */}
      <div className="w-full max-w-md mb-8 flex justify-center">
        <svg
          viewBox="0 0 111 30"
          className="w-36 h-12 text-red-600 fill-current"
          aria-hidden="true"
          focusable="false"
        >
          <g>
            <path d="M105.06 14.28L111 30c-1.75-.25-3.499-.563-5.28-.845l-3.345-8.686-3.437 7.969c-1.687-.282-3.344-.376-5.031-.595l6.031-13.75L94.155 0h5.25l3.194 8.25 3.375-8.25h5.25l-6.157 14.28h.001zm-17.22 0l6.188 14.28c-1.75-.25-3.499-.563-5.28-.845l-3.345-8.686-3.437 7.969c-1.687-.282-3.344-.376-5.031-.595l6.031-13.75L76.935 0h5.25l3.194 8.25 3.375-8.25h5.25l-6.157 14.28h-.001zm-33.001-9.84c0-1.71-.968-3.15-2.655-3.15-1.687 0-2.905 1.44-2.905 3.15v9.84c0 1.71.968 3.15 2.905 3.15 1.687 0 2.655-1.44 2.655-3.15v-9.84zm-2.655 16.995c-5.062 0-9.09-3.97-9.09-8.995v-8.01c0-5.025 4.028-8.995 9.09-8.995 5.06 0 9.09 3.97 9.09 8.995v8.01c0 5.025-4.03 8.995-9.09 8.995zm-13.821 0h-5.436V0h5.436v21.435zM17.165 0v21.435h-5.186V3.57L6.61 21.435H1.674L0 3.57v17.865h-5.186V0h7.866l3.686 15.466L10.277 0h6.888zM30.123 0v21.435h-5.436V0h5.436zm30.406 0v21.435h-5.436v-8.68h-6.658v8.68h-5.438V0h5.438v8.68h6.658V0h5.436z"></path>
          </g>
        </svg>
      </div>

      <div className="w-full max-w-md bg-black bg-opacity-75 p-8 rounded-md shadow-lg border border-gray-800">
        <h2 className="text-3xl font-bold text-white mb-6">
          {showRegister ? "Sign Up" : "Sign In"}
        </h2>

        {showRegister ? (
          <>
            <RegisterForm onRegister={() => setShowRegister(false)} />
            <div className="mt-4 text-gray-400 text-sm">
              <p>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setShowRegister(false)}
                  className="text-white hover:underline"
                >
                  Sign in now
                </button>
              </p>
            </div>
          </>
        ) : (
          <>
            <LoginForm onLogin={onLogin} />
            <div className="mt-4 text-gray-400 text-sm">
              <p>
                New to Netflix?{" "}
                <button
                  type="button"
                  onClick={() => setShowRegister(true)}
                  className="text-white hover:underline"
                >
                  Sign up now
                </button>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
