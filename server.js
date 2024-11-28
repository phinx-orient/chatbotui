import { createServer } from 'http';
import { Server } from 'socket.io';
import { spawn } from 'child_process';
import express from 'express';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Start Vite dev server
const vite = spawn('npx', ['vite', '--port', '5173'], {
  stdio: 'inherit',
  shell: true
});

// Mock thinking process with more detailed thoughts
const generateThoughts = () => {
  return [
    "Parsing input and identifying key concepts...",
    "Analyzing context and user intent...",
    "Retrieving relevant information from knowledge base...",
    "Formulating response structure...",
    "Validating response accuracy and completeness..."
  ];
};

io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('user_message', async ({ content }) => {
    const messageId = Date.now().toString();
    const thoughts = generateThoughts();
    
    // Emit thoughts sequentially
    thoughts.forEach((thought, index) => {
      setTimeout(() => {
        socket.emit('thought_update', {
          messageId,
          thought: `${thought}`
        });
      }, index * 800); // Show a new thought every 800ms
    });

    // Final response after thoughts
    setTimeout(() => {
      socket.emit('bot_response', {
        id: messageId,
        role: 'assistant',
        content: `I understand you said: "${content}". How can I help you further?`,
        thought: 'Response generated after careful analysis of user input.'
      });
    }, thoughts.length * 800 + 500); // Add extra time after last thought
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Shutting down servers...');
  vite.kill();
  server.close(() => {
    process.exit(0);
  });
});

server.listen(3000, () => {
  console.log('WebSocket server running on port 3000');
});