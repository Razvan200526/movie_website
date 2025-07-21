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
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://b08012c22cd095b600dcac8e5fec43f4@o4509621997993984.ingest.de.sentry.io/4509708445679696",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true
});


const rootElement = document.getElementById("root");
if (rootElement !== null) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={Client}>
        <App />
      </QueryClientProvider>
    </StrictMode>,
  );
}
