// Type declarations for micro-frontends
declare module 'chat/ChatApp' {
  import { FC } from 'react';
  const ChatApp: FC;
  export default ChatApp;
}

declare module 'email/EmailApp' {
  import { FC } from 'react';
  const EmailApp: FC;
  export default EmailApp;
}

// Add any shared types or interfaces that will be used across micro-frontends
declare global {
  interface Window {
    // Add any global variables or functions that might be needed
    __MICRO_APPS_READY__: boolean;
  }
}
