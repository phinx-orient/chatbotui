import { io, Socket } from 'socket.io-client';
import { Message } from '../types/chat';

export class WebSocketService {
  private socket: Socket;
  private static instance: WebSocketService;

  private constructor() {
    // Connect to the WebSocket server running locally
    this.socket = io('http://localhost:3000', {
      transports: ['websocket'],
      autoConnect: true
    });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });
  }

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  public subscribeToThoughts(callback: (thought: string, messageId: string) => void): void {
    this.socket.on('thought_update', ({ thought, messageId }) => {
      callback(thought, messageId);
    });
  }

  public sendMessage(content: string): void {
    this.socket.emit('user_message', { content });
  }

  public subscribeToResponses(callback: (message: Message) => void): void {
    this.socket.on('bot_response', (message: Message) => {
      callback(message);
    });
  }

  public disconnect(): void {
    this.socket.disconnect();
  }
}