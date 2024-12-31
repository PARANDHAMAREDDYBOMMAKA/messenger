import React, { useState, useEffect } from "react";
import Message from "./Message";
import io from "socket.io-client";

const socket = io("http://localhost:8000");

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      const message = {
        text: input,
        sender: localStorage.getItem("username"),
        timestamp: new Date().toISOString(),
      };
      socket.emit("sendMessage", message);
      setMessages((prev) => [...prev, message]);
      setInput("");
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <Message key={index} {...msg} />
        ))}
      </div>
      <div className="flex p-4">
        <input
          type="text"
          className="flex-1 p-2 border rounded"
          placeholder="Type a message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
