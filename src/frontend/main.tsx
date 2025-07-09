import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import "./index.css";
import App from "./App.tsx";

const Client = new QueryClient({
  defaultOptions: {
    mutations: {
      retry: 1,
      onError: (error) => {
        console.error("Mutation error:", error);
      },
    },
  },
});

const rootElement = document.getElementById("root");
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={Client}>
        <App />
      </QueryClientProvider>
    </StrictMode>,
  );
}
