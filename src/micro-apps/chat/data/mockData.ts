import { ChatContact, ChatMessage } from '@/shared/types';

export const mockContacts: ChatContact[] = [
  {
    id: '1',
    name: 'Abhishek Tiwari',
    email: 'abhi@example.com',
    status: 'online',
    lastMessage: 'See you at the meeting!',
    lastMessageTime: new Date(Date.now() - 5 * 60000),
    unreadCount: 2,
  },
  {
    id: '2',
    name: 'Soumya',
    email: 'soumya@example.com',
    status: 'away',
    lastMessage: 'Can you review the PR?',
    lastMessageTime: new Date(Date.now() - 30 * 60000),
    unreadCount: 1,
  },
  {
    id: '3',
    name: 'Aayushi Sharma',
    email: 'ayushi@example.com',
    status: 'offline',
    lastMessage: 'Thanks for your help!',
    lastMessageTime: new Date(Date.now() - 2 * 60 * 60000),
    unreadCount: 0,
  },
  {
    id: '4',
    name: 'Anupam',
    email: 'anupam@example.com',
    status: 'online',
    lastMessage: 'Let me know what you think',
    lastMessageTime: new Date(Date.now() - 24 * 60 * 60000),
    unreadCount: 0,
  },
];

export const mockMessages: Record<string, ChatMessage[]> = {
  '1': [
    {
      id: '1',
      senderId: '1',
      receiverId: 'me',
      content: 'Hi! How are you doing?',
      timestamp: new Date(Date.now() - 60 * 60000),
      read: true,
    },
    {
      id: '2',
      senderId: 'me',
      receiverId: '1',
      content: 'I\'m doing great! Working on the micro-frontend POC.',
      timestamp: new Date(Date.now() - 55 * 60000),
      read: true,
    },
    {
      id: '3',
      senderId: '1',
      receiverId: 'me',
      content: 'That sounds exciting! How is it going?',
      timestamp: new Date(Date.now() - 50 * 60000),
      read: true,
    },
    {
      id: '4',
      senderId: 'me',
      receiverId: '1',
      content: 'Really well! The architecture is coming together nicely.',
      timestamp: new Date(Date.now() - 10 * 60000),
      read: true,
    },
    {
      id: '5',
      senderId: '1',
      receiverId: 'me',
      content: 'See you at the meeting!',
      timestamp: new Date(Date.now() - 5 * 60000),
      read: false,
    },
  ],
  '2': [
    {
      id: '6',
      senderId: '2',
      receiverId: 'me',
      content: 'Can you review the PR when you get a chance?',
      timestamp: new Date(Date.now() - 30 * 60000),
      read: false,
    },
  ],
};
