// src/services/socket.ts
import { Message } from "../types/chat";

export class WebSocketService {
  private socket: WebSocket;
  private static instance: WebSocketService;

  private constructor(clientId: string) {
    console.log("Initializing WebSocketService...");

    // Connect to the FastAPI WebSocket server
    this.socket = new WebSocket("ws://localhost:8081/ws");

    this.socket.onopen = () => {
      console.log("WebSocket connection established.");
      this.socket.send(clientId); // Send the client ID to the server
    };

    this.socket.onclose = (event) => {
      console.log("WebSocket connection closed:", event);
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "thought_update") {
        console.log("Received thought update:", data);
        this.handleThoughtUpdate(data.thought, data.messageId);
      } else if (data.type === "bot_response") {
        console.log("Received bot response:", data);
        this.handleBotResponse(data);
      }
    };
  }

  public static getInstance(clientId: string): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService(clientId);
    }
    return WebSocketService.instance;
  }

  public sendMessage(content: string): void {
    console.log("Sending message:", content);
    this.socket.send(content);
  }

  public disconnect(): void {
    console.log("Disconnecting from WebSocket server...");
    this.socket.close();
  }

  private handleThoughtUpdate(thought: string, messageId: string) {
    // Implement your logic to handle thought updates
  }

  private handleBotResponse(message: Message) {
    // Implement your logic to handle bot responses
  }

  public subscribeToThoughts(
    callback: (thought: string, messageId: string) => void
  ): void {
    this.handleThoughtUpdate = callback; // Assign the callback to handle thought updates
  }

  public subscribeToResponses(callback: (message: Message) => void): void {
    this.handleBotResponse = callback; // Assign the callback to handle bot responses
  }
}
