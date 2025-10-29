/**
 * Event Bus for Micro-Frontend Communication
 * Enables communication between isolated micro-frontends
 */

type EventCallback = (data: any) => void;

class EventBus {
  private events: Map<string, Set<EventCallback>> = new Map();

  /**
   * Subscribe to an event
   */
  on(event: string, callback: EventCallback): () => void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    
    this.events.get(event)!.add(callback);
    
    // Return unsubscribe function
    return () => this.off(event, callback);
  }

  /**
   * Unsubscribe from an event
   */
  off(event: string, callback: EventCallback): void {
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.delete(callback);
    }
  }

  /**
   * Emit an event to all subscribers
   */
  emit(event: string, data?: any): void {
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  /**
   * Clear all event listeners
   */
  clear(): void {
    this.events.clear();
  }
}

// Global event bus instance
export const eventBus = new EventBus();

// Event type definitions for type safety
export const EVENTS = {
  NOTIFICATION_RECEIVED: 'notification:received',
  CHAT_MESSAGE_SENT: 'chat:message:sent',
  EMAIL_RECEIVED: 'email:received',
  NAVIGATE: 'app:navigate',
  SEARCH_QUERY_UPDATED: 'search:query:updated',
} as const;
