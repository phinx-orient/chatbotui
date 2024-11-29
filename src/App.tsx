import { ChatContainer } from './components/ChatContainer';
import { ChatInput } from './components/ChatInput';
import { useChat } from './hooks/useChat';

function App() {
  const { messages, sendMessage } = useChat(); // Removed isTyping from destructuring

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col"> 
      <div className="w-full h-full bg-white rounded-xl shadow-lg overflow-hidden flex flex-col flex-grow"> 
        <div className="bg-blue-600 p-4">
          <h1 className="text-white text-xl font-semibold">Neuron Ba Miền</h1>
        </div>
        
        <ChatContainer messages={messages} /> {/* Removed isTyping prop */}
        
        <div className="p-4 border-t">
          <ChatInput 
            onSendMessage={sendMessage}
            disabled={false} // Set disabled to false since isTyping is no longer available
          />
        </div>
      </div>
    </div>
  );
}

export default App;