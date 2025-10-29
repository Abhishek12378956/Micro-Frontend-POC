import { Suspense, lazy } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Lazy load the ChatApp component
const ChatApp = lazy(() => import('@/micro-apps/chat/ChatApp').then(module => ({
  default: module.ChatApp
})));

// Fallback component while the micro-frontend is loading
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    <span className="ml-3 text-lg">Loading Chat...</span>
  </div>
);

// Error fallback component
const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) => (
  <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4 text-center">
    <h2 className="text-2xl font-bold text-red-500 mb-2">Failed to load Chat</h2>
    <p className="text-gray-600 mb-4">{error.message}</p>
    <button
      onClick={resetErrorBoundary}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
    >
      Try Again
    </button>
  </div>
);

export default function Chat() {
  return (
    <div className="h-[calc(100vh-4rem)]">
      <ErrorBoundary 
        fallback={({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) => (
          <ErrorFallback error={error} resetErrorBoundary={resetErrorBoundary} />
        )}
      >
        <Suspense fallback={<LoadingFallback />}>
          <ChatApp />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
