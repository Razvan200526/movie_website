import React from "react";

interface LogoutProps {
  onLogout: () => void;
}
export const LogoutButton: React.FC<LogoutProps> = ({ onLogout }) => {
  return (
    <button
      onClick={onLogout}
      className="bg-red-800 text-white px-4 py-2 rounded-md shadow hover:bg-purple-700 transition-colors"
      aria-label="Logout"
    >
      Sign Out
    </button>
  );
};
