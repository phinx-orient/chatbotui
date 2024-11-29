import { useState, useCallback, useEffect } from "react";
import { Message } from "../types/chat";
import { WebSocketService } from "../services/socket";

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const webSocketService = WebSocketService.getInstance(
    "defaultConversationId"
  );

  useEffect(() => {
    // Set up WebSocket listener
    webSocketService.onMessage(handleIncomingMessage);

    return () => {
      webSocketService.disconnect(); // Clean up on unmount
    };
  }, [webSocketService]);

  const sendMessage = useCallback(
    (content: string, conversationId: string) => {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content,
        type: "bot_response",
      };

      // Send message to WebSocket
      webSocketService.sendMessage(
        JSON.stringify({
          type: "bot_response",
          role: "assistant",
          content: `${content}`,
          conversationId,
        })
      );

      // Update state with the user message
      setMessages((prevMessages) => [...prevMessages, userMessage]);
    },
    [webSocketService]
  );

  const handleIncomingMessage = (data: any) => {
    // Ensure data has the expected structure
    if (data && data.role) {
      const incomingMessage: Message = {
        id: Date.now().toString(),
        role: data.role,
        content: data.content || "", // Default to empty string if content is not provided
        thought: data.thought || undefined, // Handle optional thought
        type: data.type || "bot_response", // Default type if not provided
      };

      // Update state with the incoming message
      setMessages((prevMessages) => [...prevMessages, incomingMessage]);
    } else {
      console.error("Invalid message format:", data); // Log error for invalid data
    }
  };

  return {
    messages,
    sendMessage,
  };
}
