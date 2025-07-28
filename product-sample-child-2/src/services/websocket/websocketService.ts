import { EventEmitter } from 'events';

export interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: number;
}

export interface WebSocketConfig {
  url: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  heartbeatInterval?: number;
}

export class WebSocketService extends EventEmitter {
  private ws: WebSocket | null = null;
  private config: WebSocketConfig;
  private reconnectAttempts = 0;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private isIntentionallyClosed = false;

  constructor(config: WebSocketConfig) {
    super();
    this.config = {
      reconnectInterval: 5000,
      maxReconnectAttempts: 10,
      heartbeatInterval: 30000,
      ...config,
    };
  }

  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.warn('WebSocket already connected');
      return;
    }

    try {
      this.ws = new WebSocket(this.config.url);
      this.setupEventHandlers();
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.scheduleReconnect();
    }
  }

  disconnect(): void {
    this.isIntentionallyClosed = true;
    this.cleanup();
  }

  send(message: WebSocketMessage): void {
    if (this.ws?.readyState !== WebSocket.OPEN) {
      console.error('WebSocket is not connected');
      this.emit('error', new Error('WebSocket is not connected'));
      return;
    }

    try {
      this.ws.send(JSON.stringify(message));
      this.emit('messageSent', message);
    } catch (error) {
      console.error('Failed to send message:', error);
      this.emit('error', error);
    }
  }

  sendTyped<T = any>(type: string, payload: T): void {
    this.send({
      type,
      payload,
      timestamp: Date.now(),
    });
  }

  getState(): number {
    return this.ws?.readyState ?? WebSocket.CLOSED;
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  private setupEventHandlers(): void {
    if (!this.ws) return;

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
      this.emit('connected');
      this.startHeartbeat();
    };

    this.ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        this.emit('message', message);
        this.emit(`message:${message.type}`, message.payload);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
        this.emit('error', error);
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.emit('error', error);
    };

    this.ws.onclose = (event) => {
      console.log('WebSocket disconnected', { code: event.code, reason: event.reason });
      this.emit('disconnected', { code: event.code, reason: event.reason });
      this.stopHeartbeat();

      if (!this.isIntentionallyClosed && 
          this.reconnectAttempts < this.config.maxReconnectAttempts!) {
        this.scheduleReconnect();
      }
    };
  }

  private scheduleReconnect(): void {
    this.reconnectAttempts++;
    console.log(`Scheduling reconnect attempt ${this.reconnectAttempts}`);
    
    this.reconnectTimer = setTimeout(() => {
      if (!this.isIntentionallyClosed) {
        this.connect();
      }
    }, this.config.reconnectInterval);
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();
    
    this.heartbeatTimer = setInterval(() => {
      if (this.isConnected()) {
        this.sendTyped('heartbeat', { timestamp: Date.now() });
      }
    }, this.config.heartbeatInterval);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private cleanup(): void {
    this.stopHeartbeat();
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

// Singleton instance
let instance: WebSocketService | null = null;

export const initializeWebSocket = (config: WebSocketConfig): WebSocketService => {
  if (!instance) {
    instance = new WebSocketService(config);
  }
  return instance;
};

export const getWebSocketService = (): WebSocketService => {
  if (!instance) {
    throw new Error('WebSocket service not initialized');
  }
  return instance;
};