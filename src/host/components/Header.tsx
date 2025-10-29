import { Bell, Search, User, X, MessageSquare, Mail, Menu } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NotificationBadge } from '@/shared/components/Badge';
import { useState, useEffect, useRef } from 'react';
import { eventBus, EVENTS } from '@/lib/event-bus';
import { debounce } from 'lodash';

interface HeaderProps {
  onMenuToggle: () => void;
}

export const Header = ({ onMenuToggle }: HeaderProps) => {
  interface Notification {
    id: string;
    type: 'chat' | 'email';
    title: string;
    message: string;
    time: string;
    read: boolean;
    sender?: string;
    emailSubject?: string;
  }

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'chat',
      title: 'New Message',
      message: 'Hey Abhishek, how are you doing?',
      time: '2 min ago',
      read: false,
      sender: 'Ayushi Sharma'
    },
    {
      id: '2',
      type: 'email',
      title: 'New Email',
      message: 'Meeting at 6 PM tomorrow',
      emailSubject: 'Meeting Reminder',
      time: '10 min ago',
      read: false
    }
  ]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Mark notification as read when dropdown is opened
  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      // Mark all as read when opening notifications
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read: true }))
      );
    }
  };

  // Listen for chat and email events
  useEffect(() => {
    const handleChatMessage = (data: { contactId: string; message: string }) => {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      const newNotification: Notification = {
        id: `chat-${Date.now()}`,
        type: 'chat',
        title: 'New Chat Message',
        message: data.message,
        time: timeString,
        read: false,
        sender: `Chat #${data.contactId}`
      };

      setNotifications(prev => [newNotification, ...prev]);
    };

    const handleEmailReceived = (data: { subject: string; from: string; to?: string; body?: string }) => {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      // Ensure we have a valid from field, default to 'Unknown Sender' if not provided
      const sender = data.from || 'Unknown Sender';
      
      const newNotification: Notification = {
        id: `email-${Date.now()}`,
        type: 'email',
        title: data.subject || 'New Email',
        emailSubject: data.subject,
        message: `From: ${sender}${data.subject ? `\nSubject: ${data.subject}` : ''}`,
        time: timeString,
        read: false,
        sender: sender
      };

      setNotifications(prev => [newNotification, ...prev]);
    };

    // Subscribe to chat and email events
    // Using CHAT_MESSAGE_SENT since that's what's defined in the event bus
    const unsubscribeChat = eventBus.on(EVENTS.CHAT_MESSAGE_SENT, handleChatMessage);
    const unsubscribeEmail = eventBus.on(EVENTS.EMAIL_RECEIVED, handleEmailReceived);

    // Clean up event listeners
    return () => {
      unsubscribeChat();
      unsubscribeEmail();
    };
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Debounce search to avoid too many re-renders
  const debouncedSearch = useRef(
    debounce((query: string) => {
      eventBus.emit(EVENTS.SEARCH_QUERY_UPDATED, { query });
    }, 300)
  ).current;

  // Listen for notification events
  useEffect(() => {
    const unsubscribeNotification = eventBus.on(EVENTS.NOTIFICATION_RECEIVED, (data: any) => {
      // This is now handled by the specific event handlers above
      console.log('Notification received:', data);
    });

    // Cleanup debounce on unmount
    return () => {
      unsubscribeNotification();
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const clearSearch = () => {
    setSearchQuery('');
    eventBus.emit(EVENTS.SEARCH_QUERY_UPDATED, { query: '' });
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-card shadow-sm">
      <div className="flex h-16 items-center gap-4 px-4 md:px-6">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuToggle}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
            <span className="text-xl font-bold text-white">μF</span>
          </div>
          <div className="hidden md:block">
            <h1 className="text-lg font-bold text-foreground">Micro-Frontend POC</h1>
            <p className="text-xs text-muted-foreground">Modular Architecture</p>
          </div>
        </div>

        {/* Search */}
        <div className="mx-auto hidden max-w-md flex-1 md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={searchInputRef}
              placeholder="Search messages, emails..."
              className="pl-10 pr-10"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 rounded-full"
                onClick={clearSearch}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              onClick={handleNotificationClick}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <NotificationBadge count={unreadCount} />
              )}
            </Button>
            
            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="fixed md:absolute right-0 mt-2 w-[calc(100vw-2rem)] md:w-96 max-w-[calc(100vw-2rem)] md:max-w-md rounded-md border bg-card shadow-lg z-50">
                <div className="p-3 border-b border-border flex justify-between items-center">
                  <h3 className="font-medium">Notifications</h3>
                  <div className="flex items-center gap-2">
                    <button 
                      className="text-xs text-primary hover:underline"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowAllNotifications(true);
                        setShowNotifications(false);
                      }}
                    >
                      View all
                    </button>
                    <button 
                      className="text-xs text-destructive hover:underline"
                      onClick={(e) => {
                        e.stopPropagation();
                        setNotifications(prev => prev.map(n => ({...n, read: true})));
                      }}
                    >
                      Mark all as read
                    </button>
                  </div>
                </div>
                <div className="max-h-[60vh] md:max-h-80 overflow-y-auto">
                  {notifications.slice(0, 5).length > 0 ? (
                    notifications.slice(0, 5).map((notification) => (
                      <div 
                        key={notification.id} 
                        className={`p-3 border-b border-border hover:bg-accent/50 cursor-pointer transition-colors ${!notification.read ? 'bg-accent/20' : ''}`}
                        onClick={() => {
                          // Handle notification click (e.g., navigate to chat/email)
                          console.log('Notification clicked:', notification);
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`flex-shrink-0 flex items-center justify-center h-9 w-9 rounded-full ${notification.type === 'chat' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                            {notification.type === 'chat' ? (
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                            ) : (
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <p className="text-sm font-medium text-foreground">
                                {notification.type === 'chat' ? notification.sender : notification.emailSubject}
                              </p>
                              <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                {notification.time}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {notification.type === 'chat' 
                                ? notification.message.length > 50 
                                  ? `${notification.message.substring(0, 50)}...` 
                                  : notification.message
                                : notification.message}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                        <Bell className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="mt-2 text-sm font-medium text-foreground">No notifications</h3>
                      <p className="mt-1 text-sm text-muted-foreground">We'll notify you when something arrives.</p>
                    </div>
                  )}
                </div>
                {notifications.length > 0 && (
                  <div className="p-2 border-t border-border text-center">
                    <button 
                      className="text-sm font-medium text-primary hover:text-primary/80 w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowAllNotifications(true);
                        setShowNotifications(false);
                      }}
                    >
                      View all notifications
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <Button 
              variant="ghost" 
              size="icon"
              className="rounded-full"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <User className="h-4 w-4 text-foreground" />
              </div>
            </Button>
            
            {/* User Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-md border bg-card p-2 shadow-lg">
                <div className="p-2">
                  <p className="text-sm font-medium">Abhishek Tiwari</p>
                  <p className="text-xs text-muted-foreground">itc@example.com</p>
                </div>
                <div className="border-t border-border">
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-accent/50 rounded">
                    Profile
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-accent/50 rounded">
                    Settings
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-destructive hover:bg-destructive/10 rounded">
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* All Notifications Modal */}
      <Dialog open={showAllNotifications} onOpenChange={setShowAllNotifications}>
        <DialogContent className="w-[calc(100%-2rem)] sm:w-full max-w-2xl max-h-[90vh] md:max-h-[80vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <div className="flex justify-between items-center">
              <DialogTitle>All Notifications</DialogTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setNotifications(prev => prev.map(n => ({...n, read: true})));
                }}
              >
                Mark all as read
              </Button>
            </div>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto px-4 sm:px-6">
            {notifications.length > 0 ? (
              <div className="space-y-2">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className={`p-3 sm:p-4 rounded-lg border ${
                      !notification.read ? 'bg-accent/20' : 'bg-card hover:bg-accent/10'
                    } transition-colors cursor-pointer`}
                    onClick={() => {
                      // Mark as read when clicked
                      setNotifications(prev => 
                        prev.map(n => 
                          n.id === notification.id ? {...n, read: true} : n
                        )
                      );
                      // Navigate to the relevant section
                      if (notification.type === 'chat') {
                        // Navigate to chat
                      } else {
                        // Navigate to email
                      }
                    }}
                  >
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className={`mt-0.5 flex-shrink-0 flex items-center justify-center h-7 w-7 sm:h-8 sm:w-8 rounded-full ${
                        notification.type === 'chat' 
                          ? 'bg-blue-100 text-blue-600' 
                          : 'bg-purple-100 text-purple-600'
                      }`}>
                        {notification.type === 'chat' ? (
                          <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        ) : (
                          <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-sm font-medium line-clamp-1">
                            {notification.type === 'chat' 
                              ? notification.sender 
                              : notification.emailSubject}
                          </h4>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {notification.time}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                          {notification.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Bell className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="mt-2 text-sm font-medium text-foreground">No notifications yet</h3>
                <p className="mt-1 text-sm text-muted-foreground">We'll notify you when something arrives.</p>
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="border-t pt-4 -mx-6 px-6">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setShowAllNotifications(false);
                  setNotifications(prev => 
                    prev.map(n => ({ ...n, read: true }))
                  );
                }}
              >
                Mark all as read
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </header>
  );
};
