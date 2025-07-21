import React from "react";

interface LogoutProps {
  onLogout: () => void;
}
export const LogoutButton: React.FC<LogoutProps> = ({ onLogout }) => {
  return (
    <button
      onClick={onLogout}
      className="px-4 py-2 rounded-md shadow bg-red-800 text-white border-2 border-transparent hover:scale-105 hover:border-white transition-all duration-200 cursor-pointer"
      aria-label="Logout"
    >
      Sign Out
    </button>
  );
};
