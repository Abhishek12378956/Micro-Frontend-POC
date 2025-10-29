import { ChatContact } from '@/shared/types';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { Circle } from 'lucide-react';
import { NotificationBadge } from '@/shared/components/Badge';

interface ChatListProps {
  contacts: ChatContact[];
  selectedId?: string;
  onSelectContact: (id: string) => void;
}

export const ChatList = ({ contacts, selectedId, onSelectContact }: ChatListProps) => {
  return (
    <div className="flex h-full flex-col border-r bg-card">
      <div className="border-b p-4">
        <h2 className="text-lg font-semibold">Messages</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {contacts.map((contact) => (
          <button
            key={contact.id}
            onClick={() => onSelectContact(contact.id)}
            className={cn(
              'relative w-full border-b p-4 text-left transition-colors hover:bg-muted/50',
              selectedId === contact.id && 'bg-muted'
            )}
          >
            <div className="flex items-start gap-3">
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-lg font-semibold text-white">
                  {contact.name.charAt(0)}
                </div>
                <Circle
                  className={cn(
                    'absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card',
                    contact.status === 'online' && 'fill-green-500 text-green-500',
                    contact.status === 'away' && 'fill-yellow-500 text-yellow-500',
                    contact.status === 'offline' && 'fill-gray-400 text-gray-400'
                  )}
                />
              </div>
              
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-semibold text-foreground">{contact.name}</span>
                  {contact.lastMessageTime && (
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(contact.lastMessageTime, { addSuffix: true })}
                    </span>
                  )}
                </div>
                <p className="truncate text-sm text-muted-foreground">
                  {contact.lastMessage}
                </p>
              </div>
              
              {contact.unreadCount ? (
                <NotificationBadge count={contact.unreadCount} className="relative top-2" />
              ) : null}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
