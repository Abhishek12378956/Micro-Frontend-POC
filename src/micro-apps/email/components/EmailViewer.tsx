import { useState, useRef } from 'react';
import { Email } from '@/shared/types';
import { Button } from '@/components/ui/button';
import { Star, Reply, Forward, Trash2, Archive, X, Send } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type ViewMode = 'view' | 'reply' | 'forward';

interface EmailViewerProps {
  email: Email;
  onToggleStar: (id: string) => void;
  onSendEmail?: (email: { to: string; subject: string; body: string }) => void;
  onDelete?: (id: string) => void;
  onArchive?: (id: string) => void;
}

const ReplyForm = ({
  email,
  mode,
  onCancel,
  onSubmit,
}: {
  email: Email;
  mode: 'reply' | 'forward';
  onCancel: () => void;
  onSubmit: (data: { to: string; subject: string; body: string }) => void;
}) => {
  const [formData, setFormData] = useState({
    to: mode === 'reply' ? email.from.email : '',
    subject: `${mode === 'reply' ? 'Re:' : 'Fw:'} ${email.subject}`,
    body: `\n\n---------- Original Message ----------\nFrom: ${email.from.name} <${email.from.email}>\nDate: ${format(email.timestamp, 'PPpp')}\nSubject: ${email.subject}\n\n${email.body}\n`,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">{mode === 'reply' ? 'Reply' : 'Forward'}</h3>
        <Button variant="ghost" size="icon" onClick={onCancel} type="button">
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="to">To</Label>
        <Input
          id="to"
          value={formData.to}
          onChange={(e) => setFormData({...formData, to: e.target.value})}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          value={formData.subject}
          onChange={(e) => setFormData({...formData, subject: e.target.value})}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="body">Message</Label>
        <Textarea
          id="body"
          value={formData.body}
          onChange={(e) => setFormData({...formData, body: e.target.value})}
          className="min-h-[200px]"
          required
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel} type="button">
          Cancel
        </Button>
        <Button type="submit">
          <Send className="mr-2 h-4 w-4" />
          Send
        </Button>
      </div>
    </form>
  );
};

export const EmailViewer = ({ 
  email, 
  onToggleStar, 
  onSendEmail, 
  onDelete, 
  onArchive 
}: EmailViewerProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>('view');
  const [replyText, setReplyText] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const replyTextareaRef = useRef<HTMLTextAreaElement>(null);

  const handleReply = () => {
    setIsReplying(!isReplying);
    if (!isReplying) {
      // Focus the textarea after a small delay to ensure it's rendered
      setTimeout(() => {
        replyTextareaRef.current?.focus();
      }, 0);
    }
  };

  const handleForward = () => {
    setViewMode('forward');
  };

  const handleCancelReply = () => {
    if (viewMode !== 'view') {
      // If in full-page reply/forward mode, go back to view mode
      setViewMode('view');
    } else {
      // If in inline reply mode, just close the reply section
      setIsReplying(false);
      setReplyText('');
    }
  };

  const handleSendReply = () => {
    if (replyText.trim() === '') return;
    
    const replyData = {
      to: email.from.email,
      subject: `Re: ${email.subject}`,
      body: `
${replyText}

---------- Original Message ----------
From: ${email.from.name} <${email.from.email}>
Date: ${format(email.timestamp, 'PPpp')}
Subject: ${email.subject}

${email.body}
`,
    };

    if (onSendEmail) {
      onSendEmail(replyData);
      // Show a success message
      alert('Reply sent successfully!');
    }
    
    // Reset the reply state but keep the reply section open
    setReplyText('');
  };

  const handleSend = (data: { to: string; subject: string; body: string }) => {
    if (onSendEmail) {
      onSendEmail(data);
    }
    setViewMode('view');
  };

  if (viewMode !== 'view') {
    return (
      <div className="h-full bg-card">
        <ReplyForm
          email={email}
          mode={viewMode}
          onCancel={handleCancelReply}
          onSubmit={handleSend}
        />
      </div>
    );
  }
  return (
    <div className="flex h-full flex-col bg-background">
      {/* Header */}
      <div className="border-b bg-card p-4">
        <div className="mb-4 flex items-start justify-between">
          <h2 className="text-2xl font-semibold">{email.subject}</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onToggleStar(email.id)}
          >
            <Star
              className={cn(
                'h-5 w-5',
                email.starred
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-muted-foreground'
              )}
            />
          </Button>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white">
                {email.from.name.charAt(0)}
              </div>
              <div>
                <div className="font-semibold">{email.from.name}</div>
                <div className="text-sm text-muted-foreground">
                  {email.from.email}
                </div>
              </div>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            {format(email.timestamp, 'PPpp')}
          </div>
        </div>
        
        {email.labels && email.labels.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {email.labels.map((label) => (
              <Badge key={label} variant="outline">
                {label}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="prose max-w-none">
          <p className="whitespace-pre-wrap text-foreground">{email.body}</p>
        </div>

        {/* Reply Section */}
        {isReplying && (
          <div className="mt-8 border-t pt-6">
            <div className="mb-4">
              <Textarea
                ref={replyTextareaRef}
                placeholder="Type your reply here..."
                className="min-h-[120px] w-full"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={handleCancelReply}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSendReply}
                disabled={!replyText.trim()}
              >
                <Send className="mr-2 h-4 w-4" />
                Send Reply
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="border-t bg-card p-4">
        <div className="flex gap-2">
          <Button 
            variant={isReplying ? 'secondary' : 'default'}
            className="gap-2"
            onClick={handleReply}
          >
            <Reply className="h-4 w-4" />
            {isReplying ? 'Cancel Reply' : 'Reply'}
          </Button>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={handleForward}
          >
            <Forward className="h-4 w-4" />
            Forward
          </Button>
          <div className="ml-auto flex gap-2">
            {onArchive && (
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => onArchive(email.id)}
                title="Archive"
              >
                <Archive className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => onDelete(email.id)}
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
