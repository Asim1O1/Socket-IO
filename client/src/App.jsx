import './App.css';
import io from 'socket.io-client';
import { useEffect, useState } from 'react';

const socket = io.connect("http://localhost:4000");

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = () => {
    if (message) {
      socket.emit('send_message', { message });
      setMessage(""); 
    }
  };

  useEffect(() => {
    socket.on('receive_message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data.message]);
    });

    return () => {
      socket.off('receive_message'); // Clean up the event listener
    };
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-200">
      <div className="bg-blue-500 p-4 text-white text-lg font-bold">
        Chat Application
      </div>

      {/* Chat Area */}
      <div className="flex-grow p-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2 p-2 bg-white rounded-lg shadow-md">
            <p>User: {msg}</p>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-gray-300">
        <input
          type="text"
          placeholder="Type your message..."
          className="w-full p-2 border rounded-lg"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage} className="mt-2 w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600">
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
