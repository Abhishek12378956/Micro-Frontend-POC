/**
 * Shared type definitions across micro-frontends
 */

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status?: 'online' | 'offline' | 'away';
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

export interface ChatContact extends User {
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount?: number;
}

export interface Email {
  id: string;
  from: User;
  to: string[];
  subject: string;
  body: string;
  timestamp: Date;
  read: boolean;
  starred: boolean;
  labels?: string[];
}

export interface Notification {
  id: string;
  type: 'chat' | 'email' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}
