import { ChatMessage } from './ChatMessage';
import { Message } from '../types/chat';

interface ChatContainerProps {
  messages: Message[];
}

export function ChatContainer({ messages }: ChatContainerProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.map((message) => {
        // Check if the message is a bot response
        if (message.type === "bot_response") {
          // Find all thought updates that correspond to this bot response
          const thoughtUpdates = messages
            .filter(msg => msg.type === "thought_update" && msg.conversationId === message.conversationId)
            .map(msg => msg.content); // Get all matching thought updates

          return (
            <ChatMessage 
              key={`${message.conversationId}-${message.content}`} // Ensure unique key
              message={message} 
              thoughtUpdates={thoughtUpdates} // Pass all thought updates
            />
          );
        }
        return null; // Ensure to return null for other message types
      })}
    </div>
  );
}