import { useState } from 'react';
import { ChatMessage, ChatContact } from '@/shared/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface MessageThreadProps {
  contact: ChatContact;
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
}

export const MessageThread = ({ contact, messages, onSendMessage }: MessageThreadProps) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Header */}
      <div className="border-b bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white">
            {contact.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold">{contact.name}</h3>
            <p className="text-xs text-muted-foreground capitalize">{contact.status}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-1 overflow-y-auto p-4">
        {messages.map((message) => {
          const isOwn = message.senderId === 'me';
          return (
            <div
              key={message.id}
              className={cn('flex', isOwn ? 'justify-end' : 'justify-start')}
            >
              <div
                className={cn(
                  'max-w-[70%] rounded-2xl px-4 py-2',
                  isOwn
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                )}
              >
                <p className="text-sm">{message.content}</p>
                <span className="mt-1 block text-xs opacity-70">
                  {format(message.timestamp, 'HH:mm')}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="border-t bg-card p-4">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button onClick={handleSend} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
