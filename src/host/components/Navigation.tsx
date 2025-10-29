import { NavLink } from 'react-router-dom';
import { Mail, MessageSquare, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NotificationBadge } from '@/shared/components/Badge';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { to: '/chat', icon: MessageSquare, label: 'Chat', badge: 3 },
  { to: '/email', icon: Mail, label: 'Email', badge: 5 },
];

interface NavigationProps {
  onNavigate?: () => void;
}

export const Navigation = ({ onNavigate }: NavigationProps) => {
  return (
    <nav className="w-full h-full border-r bg-muted p-4 md:w-64">
      <div className="space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.exact}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'relative flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
                {item.badge && !isActive && (
                  <NotificationBadge count={item.badge} variant="default" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Micro-Frontend Info */}
      <div className="mt-8 rounded-lg border bg-card p-4">
        <h3 className="mb-2 text-sm font-semibold">Architecture</h3>
        <div className="space-y-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span>Host App: Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span>Chat Module: Loaded</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span>Email Module: Loaded</span>
          </div>
        </div>
      </div>
    </nav>
  );
};
