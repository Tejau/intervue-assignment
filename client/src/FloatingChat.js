import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:8000');  // Connect to Socket.IO server

const FloatingChat = () => {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    // Listen for incoming chat messages
    socket.on('chatMessage', (newMessage) => {
      setChatMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // Clean up socket listener when the component unmounts
    return () => {
      socket.off('chatMessage');
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('chatMessage', message); // Send message to server
      setMessage(''); // Clear the input field
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-64 bg-white border border-gray-300 rounded-lg shadow-lg">
      <div className="p-4">
        <h4 className="font-bold mb-2">Chat</h4>
        <div className="h-48 overflow-y-auto mb-2">
          {chatMessages.map((msg, index) => (
            <div key={index} className="text-sm text-gray-800 mb-1">{msg}</div>
          ))}
        </div>
        <input
          type="text"
          className="w-full border border-gray-300 rounded-md p-2 mb-2"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="w-full bg-purple-500 text-white py-2 rounded-md hover:bg-purple-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default FloatingChat;
