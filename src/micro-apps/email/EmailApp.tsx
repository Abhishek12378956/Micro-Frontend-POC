import { useState, useEffect } from 'react';
import { EmailList } from './components/EmailList';
import { EmailViewer } from './components/EmailViewer';
import { mockEmails } from './data/mockData';
import { eventBus, EVENTS } from '@/lib/event-bus';
import { Email } from '@/shared/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Email Micro-Frontend Application
 * Handles all email-related functionality independently
 */
export const EmailApp = () => {
  const [allEmails, setAllEmails] = useState(mockEmails);
  const [filteredEmails, setFilteredEmails] = useState(mockEmails);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmailId, setSelectedEmailId] = useState<string>('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showEmailViewer, setShowEmailViewer] = useState(false);

  const selectedEmail = filteredEmails.find(e => e.id === selectedEmailId);

  const handleToggleStar = (id: string) => {
    const updatedEmails = allEmails.map(email =>
      email.id === id ? { ...email, starred: !email.starred } : email
    );
    setAllEmails(updatedEmails);
    filterEmails(searchQuery, updatedEmails);
  };

  // Handle window resize for mobile detection and initial setup
  useEffect(() => {
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);
    
    // On desktop, always show the email viewer if an email is selected
    if (!mobile && selectedEmailId) {
      setShowEmailViewer(true);
    } else if (!mobile && filteredEmails.length > 0) {
      // On desktop with no email selected, show the first email by default
      const firstEmailId = filteredEmails[0]?.id;
      if (firstEmailId) {
        setSelectedEmailId(firstEmailId);
        setShowEmailViewer(true);
      }
    } else if (mobile && selectedEmailId) {
      setShowEmailViewer(true);
    }

    const handleResize = () => {
      const newIsMobile = window.innerWidth < 768;
      if (newIsMobile !== isMobile) {
        setIsMobile(newIsMobile);
        if (!newIsMobile && selectedEmailId) {
          setShowEmailViewer(true);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [selectedEmailId, filteredEmails]);

  const handleSelectEmail = (id: string) => {
    setSelectedEmailId(id);
    
    // Mark as read
    const updatedEmails = allEmails.map(email =>
      email.id === id ? { ...email, read: true } : email
    );
    setAllEmails(updatedEmails);
    filterEmails(searchQuery, updatedEmails);

    // On mobile, show the email viewer
    if (isMobile) {
      setShowEmailViewer(true);
    }

    // Emit event
    eventBus.emit(EVENTS.EMAIL_RECEIVED, {
      emailId: id,
    });
  };

  const handleBackToList = () => {
    setShowEmailViewer(false);
  };

  const handleSendEmail = ({ to, subject, body }: { to: string; subject: string; body: string }) => {
    // Create a new email object for the sent email
    const senderInfo = {
      id: 'me',
      name: 'Me',
      email: 'me@example.com'
    };

    const newEmail = {
      id: `email-${Date.now()}`,
      from: senderInfo,
      to: [to],
      subject,
      body,
      timestamp: new Date(),
      read: true,
      starred: false,
      labels: ['sent']
    };

    // Add the sent email to the list
    setAllEmails(prevEmails => [newEmail, ...prevEmails]);
    
    // Update the filtered emails
    filterEmails(searchQuery, [newEmail, ...allEmails]);
    
    // Emit notification event
    eventBus.emit(EVENTS.EMAIL_RECEIVED, {
      subject: subject,
      from: senderInfo.name,
      to: to,
      body: body
    });
    
    // In a real app, you would make an API call here to actually send the email
    console.log('Email sent:', { to, subject, body });
  };

  const handleDeleteEmail = (id: string) => {
    if (window.confirm('Are you sure you want to delete this email?')) {
      const updatedEmails = allEmails.filter(email => email.id !== id);
      setAllEmails(updatedEmails);
      filterEmails(searchQuery, updatedEmails);
      
      // If the deleted email was selected, clear the selection
      if (selectedEmailId === id) {
        const remainingEmails = updatedEmails.filter(email => email.id !== id);
        setSelectedEmailId(remainingEmails[0]?.id || '');
      }
      
      // In a real app, you would also make an API call to delete the email from the server
      console.log('Email deleted:', id);
    }
  };

  const handleArchiveEmail = (id: string) => {
    const updatedEmails = allEmails.map(email =>
      email.id === id 
        ? { ...email, archived: true, folder: 'archived' } 
        : email
    );
    setAllEmails(updatedEmails);
    filterEmails(searchQuery, updatedEmails);
    
    // In a real app, you would also make an API call to update the email status on the server
    console.log('Email archived:', id);
    
    // Show a success message
    alert('Email has been archived');
  };

  const filterEmails = (query: string, emailsToFilter = allEmails) => {
    if (!query.trim()) {
      setFilteredEmails(emailsToFilter);
      return;
    }

    const lowerCaseQuery = query.toLowerCase();
    const filtered = emailsToFilter.filter(
      email =>
        email.subject.toLowerCase().includes(lowerCaseQuery) ||
        email.from.name.toLowerCase().includes(lowerCaseQuery) ||
        email.from.email.toLowerCase().includes(lowerCaseQuery) ||
        email.body.toLowerCase().includes(lowerCaseQuery)
    );
    
    setFilteredEmails(filtered);
  };

  // Handle search from both local input and global header
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterEmails(query);
  };

  useEffect(() => {
    console.log('[Email App] Mounted - Micro-frontend loaded');
    
    // Subscribe to search events from header
    const unsubscribeSearch = eventBus.on(EVENTS.SEARCH_QUERY_UPDATED, ({ query }: { query: string }) => {
      console.log('Search query received in EmailApp:', query);
      handleSearch(query);
    });
    
    return () => {
      console.log('[Email App] Unmounted');
      unsubscribeSearch();
    };
  }, []);
  
  // Update filtered emails when allEmails changes
  useEffect(() => {
    filterEmails(searchQuery);
  }, [allEmails]);

  return (
    <div className="flex h-full relative">
      {/* Email List - Always visible on desktop, conditionally on mobile */}
      <div className={cn(
        'w-full md:w-96 flex-shrink-0 transition-transform duration-300 h-full border-r',
        isMobile && showEmailViewer ? '-translate-x-full' : 'translate-x-0',
        'md:translate-x-0' // Always show on desktop
      )}>
        <div className="border-b p-4 bg-card">
          <div className="relative">
            <input
              type="text"
              placeholder="Search emails..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-4 py-2 pl-10 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        <EmailList
          emails={filteredEmails}
          selectedId={selectedEmailId}
          onSelectEmail={handleSelectEmail}
        />
      </div>

      {/* Email Viewer - Conditionally shown based on selection */}
      <div className={cn(
        'absolute inset-0 md:static flex-1 transition-transform duration-300 bg-background',
        isMobile && !showEmailViewer ? 'translate-x-full' : 'translate-x-0',
        'md:translate-x-0' // Always show on desktop
      )}>
        {selectedEmail ? (
          <div className="h-full flex flex-col">
            {/* Back button for mobile */}
            {isMobile && (
              <div className="flex items-center p-2 border-b bg-card">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToList}
                  className="md:hidden"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to inbox
                </Button>
              </div>
            )}
            <EmailViewer
              email={selectedEmail}
              onToggleStar={handleToggleStar}
              onSendEmail={handleSendEmail}
              onDelete={(id) => {
                handleDeleteEmail(id);
                if (isMobile) {
                  setShowEmailViewer(false);
                }
              }}
              onArchive={(id) => {
                handleArchiveEmail(id);
                if (isMobile) {
                  setShowEmailViewer(false);
                }
              }}
            />
          </div>
        ) : (
          <div className="hidden md:flex h-full items-center justify-center text-muted-foreground">
            Select an email to read
          </div>
        )}
      </div>
    </div>
  );
};
