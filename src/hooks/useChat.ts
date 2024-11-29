// src/hooks/useChat.ts
import { useCallback, useEffect, useState } from "react";
import { WebSocketService } from "../services/socket";
import { Message, ChatState } from "../types/chat";

export function useChat() {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isTyping: false,
  });

  useEffect(() => {
    const clientId = Date.now().toString(); // Generate a unique client ID
    const ws = WebSocketService.getInstance(clientId); // Pass the client ID to the WebSocketService

    // Subscribe to thought updates
    ws.subscribeToThoughts((thought, messageId) => {
      console.log(
        "Received thought update:",
        thought,
        "for messageId:",
        messageId
      );
      setChatState((prev) => ({
        ...prev,
        messages: prev.messages.map((msg) =>
          msg.id === messageId ? { ...msg, thought } : msg
        ),
        isTyping: true, // Keep typing indicator while thoughts are being processed
      }));
    });

    // Subscribe to responses
    ws.subscribeToResponses((message) => {
      console.log("Received bot response:", message);
      setChatState((prev) => ({
        ...prev,
        messages: [...prev.messages, message],
        isTyping: false,
      }));
    });

    // Log when the WebSocket is connected
    console.log("WebSocket connection established.");

    return () => {
      console.log("Disconnecting from WebSocket...");
      ws.disconnect();
    };
  }, []);

  const sendMessage = useCallback((content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
    };

    console.log("Sending user message:", userMessage);
    setChatState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isTyping: true,
    }));

    WebSocketService.getInstance(userMessage.id).sendMessage(content); // Use the userMessage ID for sending
  }, []);

  return { messages: chatState.messages, sendMessage };
}
