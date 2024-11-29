import { Message } from "../types/chat";

export class WebSocketService {
  private socket!: WebSocket; // Ensure this is typed as WebSocket
  private static instance: WebSocketService;
  private handleThoughtUpdate: (thought: string, messageId: string) => void =
    () => {};
  private handleBotResponse: (message: Message) => void = () => {};
  private messageHandler: (data: any) => void = () => {}; // Message handler

  private constructor(conversationId: string) {
    console.log("Initializing WebSocketService...");
    this.connect(conversationId);
  }

  private connect(conversationId: string): void {
    this.socket = new WebSocket(`ws://localhost:8081/ws/${conversationId}`);

    this.socket.onopen = () => {
      console.log("WebSocket connection established.");
    };

    this.socket.onclose = (event) => {
      console.log("WebSocket connection closed:", event);
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.messageHandler(data); // Call the registered message handler
    };
  }

  public static getInstance(conversationId: string): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService(conversationId);
    }
    return WebSocketService.instance;
  }

  public onMessage(handler: (data: any) => void) {
    this.messageHandler = handler; // Set the message handler
  }

  public subscribeToThoughts(
    callback: (thought: string, messageId: string) => void
  ) {
    this.handleThoughtUpdate = callback;
  }

  public subscribeToResponses(callback: (message: Message) => void) {
    this.handleBotResponse = callback;
  }

  public disconnect() {
    this.socket.close();
  }

  public sendMessage(message: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message); // Ensure the socket is open before sending
    } else {
      console.error("WebSocket is not open. Cannot send message.");
    }
  }
}
