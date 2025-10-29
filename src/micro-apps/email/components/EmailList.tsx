import { Email } from '@/shared/types';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { Star, Paperclip } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface EmailListProps {
  emails: Email[];
  selectedId?: string;
  onSelectEmail: (id: string) => void;
}

export const EmailList = ({ emails, selectedId, onSelectEmail }: EmailListProps) => {
  return (
    <div className="flex h-full flex-col border-r bg-card">
      <div className="border-b p-4">
        <h2 className="text-lg font-semibold">Inbox</h2>
        <p className="text-sm text-muted-foreground">
          {emails.filter(e => !e.read).length} unread messages
        </p>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {emails.map((email) => (
          <button
            key={email.id}
            onClick={() => onSelectEmail(email.id)}
            className={cn(
              'w-full border-b p-4 text-left transition-colors hover:bg-muted/50',
              selectedId === email.id && 'bg-muted',
              !email.read && 'bg-primary/5 font-semibold'
            )}
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Star
                    className={cn(
                      'h-4 w-4',
                      email.starred
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-muted-foreground'
                    )}
                  />
                  <span className="font-semibold text-foreground">
                    {email.from.name}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(email.timestamp, { addSuffix: true })}
                </span>
              </div>
              
              <div>
                <h3 className={cn(
                  'mb-1 text-sm',
                  !email.read ? 'font-semibold' : 'font-normal'
                )}>
                  {email.subject}
                </h3>
                <p className="line-clamp-2 text-xs text-muted-foreground">
                  {email.body}
                </p>
              </div>
              
              {email.labels && email.labels.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {email.labels.map((label) => (
                    <Badge key={label} variant="secondary" className="text-xs">
                      {label}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
