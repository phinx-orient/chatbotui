import { ChatMessage } from './ChatMessage';
import { Message } from '../types/chat';

interface ChatContainerProps {
  messages: Message[];
}

interface ChatMessageWithThoughts {
  message: Message;
  thoughtUpdates: string[];
}

export function ChatContainer({ messages }: ChatContainerProps) {
  const chatMessages: ChatMessageWithThoughts[] = [];
  let thoughtUpdates: string[] = [];

  messages.forEach((message) => {
    if (message.type === "thought_update") {
      // Collect thought updates until a bot response is encountered
      thoughtUpdates.push(message.content);
    } else if (message.type === "bot_response") {
      // When a bot response is encountered, push the response and its thought updates
      chatMessages.push({ message, thoughtUpdates });
      // Reset thought updates for the next bot response
      thoughtUpdates = [];
    }
  });

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {chatMessages.map(({ message, thoughtUpdates }) => (
        <ChatMessage 
          key={`${message.conversationId}-${message.content}`}
          message={message} 
          thoughtUpdates={thoughtUpdates}
        />
      ))}
    </div>
  );
}