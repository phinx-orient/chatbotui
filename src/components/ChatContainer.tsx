import { ChatMessage } from './ChatMessage';
import { Message } from '../types/chat';

interface ChatContainerProps {
  messages: Message[];
}

export function ChatContainer({ messages }: ChatContainerProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.map((message) => {
        if (message.type === "thought_update") {
          // Render thought update in an expander
          return (
            <div key={message.id} className="mb-2">
              <div className="p-2 bg-yellow-100 border border-yellow-300 rounded">
                <strong>Thought Update:</strong> {message.thought}
              </div>
            </div>
          );
        } else if (message.type === "bot_response") {
          // Render bot response with specific structure
          return (
            <ChatMessage 
              key={message.id} 
              message={{
                type: "bot_response",
                role: "assistant",
                content: `This is a response to: ${message.content}`,
                id: "1",
                thought: message.thought,
              }} 
            />
          );
        } else {
          // Render other message types normally
          return (
            <ChatMessage key={message.id} message={message} />
          );
        }
      })}
    </div>
  );
}