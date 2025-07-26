import EntryPoint from "./components/Entry/EntryPoint.tsx"
import { BrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "./components/Error/ErrorBoundary.tsx";
export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <EntryPoint />
      </BrowserRouter>
    </ErrorBoundary>
  );
}
