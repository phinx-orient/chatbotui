// src/hooks/useChat.ts
import { useState, useCallback, useEffect } from "react";
import { v4 as uuidv4 } from "uuid"; // Import UUID package
import { Message } from "../types/chat";
import { WebSocketService } from "../services/socket";
import axios from "axios";
export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);

  const existingConversationId = sessionStorage.getItem("conversationId");

  const conversationId = existingConversationId || uuidv4();
  if (!existingConversationId) {
    sessionStorage.setItem("conversationId", conversationId); // Store the new UUID in sessionStorage
  }

  const webSocketService = WebSocketService.getInstance(conversationId); // Use the UUID for the WebSocket connection
  console.log(`conversationId: ${conversationId}`);
  useEffect(() => {
    webSocketService.onMessage(handleIncomingMessage);

    return () => {
      webSocketService.disconnect(); // Clean up on unmount
    };
  }, [webSocketService]);

  const sendMessage = useCallback(
    async (content: string) => {
      const userMessage: Message = {
        conversationId: conversationId,
        role: "user",
        content,
        type: "user_response",
      };

      // Update state with the user message immediately
      setMessages((prevMessages) => [...prevMessages, userMessage]);

      // Send message to WebSocket
      webSocketService.sendMessage(
        JSON.stringify({
          type: "user_response",
          role: "assistant",
          content: `${content}`,
          conversationId,
        })
      );

      const baseUrl = "http://localhost:8007/streaming"; // Endpoint URL

      try {
        // Construct the URL with query parameters
        const url = `${baseUrl}?content=${encodeURIComponent(
          content
        )}&conversation_id=${encodeURIComponent(conversationId)}`;

        // Make the POST request
        const response = await axios.post(url);

        console.log("Response:", response.data);
      } catch (error) {
        console.error("Error calling streaming endpoint:", error);
      }
    },
    [webSocketService, conversationId] // Added conversationId to dependencies
  );

  const handleIncomingMessage = (data: any) => {
    try {
      console.log("Raw incoming data:", data); // Log the raw incoming data
      // data is an object of js
      const parsedData = typeof data === "string" ? JSON.parse(data) : data; // Check if data is a string before parsing

      if (parsedData && parsedData.role) {
        const incomingMessage: Message = {
          conversationId: parsedData.conversationId,
          role: parsedData.role,
          content: parsedData.content || "",
          type: parsedData.type || "bot_response",
        };

        // Update state with the incoming message
        setMessages((prevMessages) => [...prevMessages, incomingMessage]);
      } else {
        console.error("Invalid message format:", parsedData);
      }
    } catch (error) {
      console.error("Error parsing incoming message:", error);
    }
  };

  return {
    messages,
    sendMessage,
  };
}
