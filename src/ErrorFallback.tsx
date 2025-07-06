import * as Sentry from "@sentry/react";

interface SentryErrorFallbackProps {
  error: unknown;
  componentStack: string;
  eventId: string;
  resetError(): void;
}

export const ErrorFallback = ({
  error,
  componentStack,
  eventId,
  resetError,
}: SentryErrorFallbackProps) => {
  // Ensure error is captured by Sentry
  Sentry.captureException(error);

  // Convert unknown error to string for display
  const errorMessage = error instanceof Error ? error.message : String(error);

  return (
    <div
      role="alert"
      className="error-fallback p-8 text-center bg-dark-100 rounded-lg"
    >
      <h2 className="text-2xl font-bold text-red-500 mb-4">
        Something went wrong!
      </h2>
      <p className="text-white mb-4">
        We're sorry, but something unexpected happened.
      </p>
      <pre className="bg-red-100 p-4 rounded text-red-800 text-sm overflow-auto mb-4 max-h-32">
        {errorMessage}
      </pre>
      <div className="space-x-4">
        <button
          onClick={resetError}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Reload Page
        </button>
      </div>
      {eventId && (
        <p className="text-gray-400 text-sm mt-4">Event ID: {eventId}</p>
      )}
    </div>
  );
};
