import { useState, useEffect } from 'react';
import { ChatList } from './components/ChatList';
import { MessageThread } from './components/MessageThread';
import { mockContacts, mockMessages } from './data/mockData';
import { eventBus, EVENTS } from '@/lib/event-bus';
import { ChatMessage } from '@/shared/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Chat Micro-Frontend Application
 * Handles all chat-related functionality independently
 */
export const ChatApp = () => {
  const [selectedContactId, setSelectedContactId] = useState<string>('');
  const [messages, setMessages] = useState(mockMessages);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showChatThread, setShowChatThread] = useState(false);

  const selectedContact = mockContacts.find(c => c.id === selectedContactId);
  const currentMessages = selectedContactId ? messages[selectedContactId] || [] : [];

  // Handle window resize for mobile detection and initial setup
  useEffect(() => {
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);
    
    // On desktop, always show the chat thread if a contact is selected
    if (!mobile && selectedContactId) {
      setShowChatThread(true);
    } else if (!mobile) {
      // On desktop with no contact selected, show the first contact by default
      const firstContactId = mockContacts[0]?.id;
      if (firstContactId) {
        setSelectedContactId(firstContactId);
        setShowChatThread(true);
      }
    }

    const handleResize = () => {
      const newIsMobile = window.innerWidth < 768;
      if (newIsMobile !== isMobile) {
        setIsMobile(newIsMobile);
        if (!newIsMobile && selectedContactId) {
          setShowChatThread(true);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [selectedContactId]);

  const handleSelectContact = (contactId: string) => {
    setSelectedContactId(contactId);
    // Always show chat thread on desktop, only set to true on mobile
    if (isMobile) {
      setShowChatThread(true);
    } else {
      setShowChatThread(true);
    }
  };

  const handleBackToList = () => {
    setShowChatThread(false);
  };

  const handleSendMessage = (content: string) => {
    if (!selectedContactId) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'me',
      receiverId: selectedContactId,
      content,
      timestamp: new Date(),
      read: true,
    };

    setMessages(prev => ({
      ...prev,
      [selectedContactId]: [...(prev[selectedContactId] || []), newMessage],
    }));

    // Emit event to notify other micro-frontends
    eventBus.emit(EVENTS.CHAT_MESSAGE_SENT, {
      contactId: selectedContactId,
      message: content,
    });

    eventBus.emit(EVENTS.NOTIFICATION_RECEIVED, {
      type: 'chat',
      message: 'Message sent successfully',
    });
  };

  useEffect(() => {
    console.log('[Chat App] Mounted - Micro-frontend loaded');
    
    return () => {
      console.log('[Chat App] Unmounted');
    };
  }, []);

  return (
    <div className="flex h-full relative">
      {/* Chat List - Always visible on desktop, conditionally on mobile */}
      <div className={cn(
        'w-full md:w-80 flex-shrink-0 transition-transform duration-300 h-full',
        isMobile && showChatThread ? '-translate-x-full' : 'translate-x-0',
        'md:translate-x-0', // Always show on desktop
      )}>
        <ChatList
          contacts={mockContacts}
          selectedId={selectedContactId}
          onSelectContact={handleSelectContact}
        />
      </div>

      {/* Chat Thread - Conditionally shown based on selection */}
      <div className={cn(
        'absolute inset-0 md:static flex-1 transition-transform duration-300',
        isMobile && !showChatThread ? 'translate-x-full' : 'translate-x-0',
        'md:translate-x-0' // Always show on desktop
      )}>
        {selectedContact ? (
          <div className="h-full flex flex-col">
            {/* Back button for mobile */}
            {isMobile && (
              <div className="flex items-center p-2 border-b">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToList}
                  className="md:hidden"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to messages
                </Button>
              </div>
            )}
            <MessageThread
              contact={selectedContact}
              messages={currentMessages}
              onSendMessage={handleSendMessage}
            />
          </div>
        ) : (
          <div className="hidden md:flex h-full items-center justify-center text-muted-foreground">
            Select a contact to start chatting
          </div>
        )}
      </div>
    </div>
  );
};
