import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: ReactNode;
  className?: string;
}

export const AppLayout = ({ children, className }: AppLayoutProps) => {
  return (
    <div className={cn('min-h-screen bg-background', className)}>
      {children}
    </div>
  );
};

export const AppContent = ({ children, className }: AppLayoutProps) => {
  return (
    <main className={cn('flex-1 overflow-auto', className)}>
      {children}
    </main>
  );
};
