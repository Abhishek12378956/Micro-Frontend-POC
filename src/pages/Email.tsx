import { Suspense, lazy } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Lazy load the EmailApp component
const EmailApp = lazy(() => import('@/micro-apps/email/EmailApp').then(module => ({
  default: module.EmailApp
})));

// Fallback component while the micro-frontend is loading
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    <span className="ml-3 text-lg">Loading Email...</span>
  </div>
);

// Error fallback component
const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) => (
  <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4 text-center">
    <h2 className="text-2xl font-bold text-red-500 mb-2">Failed to load Email</h2>
    <p className="text-gray-600 mb-4">{error.message}</p>
    <button
      onClick={resetErrorBoundary}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
    >
      Try Again
    </button>
  </div>
);

export default function Email() {
  return (
    <div className="h-[calc(100vh-4rem)]">
      <ErrorBoundary 
        fallback={({ error, resetErrorBoundary }) => (
          <ErrorFallback error={error!} resetErrorBoundary={resetErrorBoundary} />
        )}
      >
        <Suspense fallback={<LoadingFallback />}>
          <EmailApp />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
