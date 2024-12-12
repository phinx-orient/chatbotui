import { useState } from "react";
import { ChatMessage } from "./ChatMessage";
import { Message } from "../types/chat";
import { ChevronDown, ChevronUp } from "lucide-react"; // Import the icons

interface ChatContainerProps {
  messages: Message[];
}

interface ChatMessageWithThoughts {
  message: Message;
  thoughtUpdates: string[][]; // Array of thought updates
}

export function ChatContainer({ messages }: ChatContainerProps) {
  const chatMessages: ChatMessageWithThoughts[] = [];
  let thoughtUpdates: string[][] = [];
  let currentMessage: Message | null = null; // Track the current message being built

  messages.forEach((message) => {
    if (message.type === "thought_update") {
      if (currentMessage) {
        chatMessages.push({ message: currentMessage, thoughtUpdates });
        currentMessage = null;
        thoughtUpdates = [];
      }
      currentMessage = {
        ...message,
        content: "",
      };
      thoughtUpdates.push(formatThoughtUpdate(message.tool_kwargs));
    } else if (message.type === "bot_response") {
      if (currentMessage) {
        chatMessages.push({ message: currentMessage, thoughtUpdates });
        currentMessage = null;
        thoughtUpdates = [];
      }
      currentMessage = message;
    } else if (message.type === "user_response") {
      if (currentMessage) {
        chatMessages.push({ message: currentMessage, thoughtUpdates });
        currentMessage = null;
        thoughtUpdates = [];
      }
      currentMessage = message;
    }
  });

  if (currentMessage) {
    chatMessages.push({ message: currentMessage, thoughtUpdates });
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {chatMessages.map(({ message, thoughtUpdates }, index) => (
        <div
          key={`${message.conversationId}-${index}`}
          className="chat-message"
        >
          <ChatMessage message={message} />
          {thoughtUpdates.length > 0 && (
            <ThoughtUpdatesExpander
              thoughtUpdates={thoughtUpdates}
              toolName={message.tool_name}
              tool_kwargs={message.tool_kwargs} // Pass tool_kwargs to the expander
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ThoughtUpdatesExpander defined directly in ChatContainer
const ThoughtUpdatesExpander: React.FC<{
  thoughtUpdates: string[][];
  toolName: string;
  tool_kwargs: string; // Add tool_kwargs prop
}> = ({ thoughtUpdates, toolName, tool_kwargs }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="thought-updates-container max-w-fit">
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
          {thoughtUpdates.map((update, index) => {
            const toolArgs = update;
            return (
              <div
                key={index}
                className="thought-update text-sm mb-4 border border-blue-300 shadow-md p-3 rounded-lg transition-all duration-200 hover:shadow-lg"
              >
                <div className="font-semibold text-blue-600">{toolName}</div>
                <div className="text-gray-800">
                  <strong>Tool Args:</strong> {toolArgs}
                </div>
                <div className="text-gray-800">
                  <strong>Tool Kwargs:</strong> {tool_kwargs} {/* Render tool_kwargs */}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Helper function to format thought updates
const formatThoughtUpdate = (content: string) => {
  try {
    const parsedContent = JSON.parse(content);
    return parsedContent.map(
      (item: { tool_name: string; tool_kwargs: Record<string, any> }) =>
        `Tool Name: ${item.tool_name}\nTool Args:\n${JSON.stringify(
          item.tool_kwargs,
          null,
          2
        )}`
    );
  } catch (error) {
    return [content];
  }
};