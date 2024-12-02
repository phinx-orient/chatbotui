// src/components/ChatContainer.tsx
import { useState } from 'react';
import { ChatMessage } from './ChatMessage';
import { Message } from '../types/chat';
import { ChevronDown, ChevronUp } from 'lucide-react'; // Import the icons

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
  let currentMessage: Message | null = null; // Track the current message being built

  messages.forEach((message) => {
    if (message.type === "thought_update") {
      // If it's a thought update, accumulate it
      if (currentMessage) {
        thoughtUpdates.push(message.content); // Append to existing thought updates
      } else {
        // If there's no current message, we need to create one for the first thought update
        currentMessage = message; // Set the current message to the thought update
        thoughtUpdates = []; // Initialize thought updates
      }
    } else if (message.type === "bot_response") {
      // When a bot response is encountered, push the response and its thought updates
      if (currentMessage) {
        chatMessages.push({ message: currentMessage, thoughtUpdates }); // Push the accumulated message
        currentMessage = null; // Reset current message for the next set
        thoughtUpdates = []; // Reset thought updates for the next bot response
      }
      // Create a new message for the bot response
      currentMessage = message; // Set the current message to the bot response
    } else if (message.type === "user_response") {
      // Add user message with empty thought updates
      if (currentMessage) {
        chatMessages.push({ message: currentMessage, thoughtUpdates }); // Push the accumulated message
        currentMessage = null; // Reset current message for the next set
        thoughtUpdates = []; // Reset thought updates for the next user response
      }
      // Create a new message for the user response
      currentMessage = message; // Set the current message to the user response
    }
  });

  // If there's a remaining message after processing all messages, push it
  if (currentMessage) {
    chatMessages.push({ message: currentMessage, thoughtUpdates });
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {chatMessages.map(({ message, thoughtUpdates }, index) => (
        <div key={`${message.conversationId}-${index}`} className="chat-message">
          <ChatMessage 
            message={message} 
          />
          {thoughtUpdates.length > 0 && (
            <ThoughtUpdatesExpander thoughtUpdates={thoughtUpdates} />
          )}
        </div>
      ))}
    </div>
  );
}

// ThoughtUpdatesExpander defined directly in ChatContainer
const ThoughtUpdatesExpander: React.FC<{ thoughtUpdates: string[] }> = ({ thoughtUpdates }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="thought-updates-container">
      <button 
        onClick={() => setIsExpanded(!isExpanded)} 
        className="flex items-center gap-1 text-sm font-bold text-gray-800 transition-colors duration-200 rounded-md p-2 bg-blue-50 hover:bg-blue-100"
      >
        {isExpanded ? (
          <>
            <ChevronUp className="w-4 h-4" />
            Hide Thought Updates
          </>
        ) : (
          <>
            <ChevronDown className="w-4 h-4" />
            Show Thought Updates
          </>
        )}
      </button>
      {isExpanded && (
        <div className="thought-updates mt-2 p-3 bg-blue-100 rounded-md animate-fadeIn">
          {thoughtUpdates.map((update, index) => (
            <div key={index} className="thought-update text-sm text-gray-700">
              {update}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};