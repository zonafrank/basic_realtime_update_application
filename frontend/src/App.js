import React, { useEffect, useState } from "react";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const socket = new WebSocket(`ws://${window.location.host}`);
    setWs(socket);

    socket.onmessage = (event) => {
      const { data } = event;
      const message = JSON.parse(data);
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    return () => socket.close();
  }, []);

  const sendMessage = () => {
    if (ws && input.trim()) {
      ws.send(JSON.stringify({ message: input }));
      setInput("");
    }
  };

  return (
    <div>
      <h1>Real-time Chat</h1>
      <div>
        {messages.map((msg, index) => {
          return <div key={index}>{msg.message}</div>;
        })}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default App;
