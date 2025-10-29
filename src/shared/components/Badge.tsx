import { cn } from '@/lib/utils';

interface BadgeProps {
  count?: number;
  className?: string;
  variant?: 'default' | 'notification';
}

export const NotificationBadge = ({ count, className, variant = 'notification' }: BadgeProps) => {
  if (!count || count === 0) return null;

  return (
    <span
      className={cn(
        'absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-semibold text-white',
        variant === 'notification' && 'bg-destructive',
        variant === 'default' && 'bg-primary',
        className
      )}
    >
      {count > 99 ? '99+' : count}
    </span>
  );
};
