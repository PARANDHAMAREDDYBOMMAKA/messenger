import React, { useState, useEffect } from "react";
import Message from "./Message";
import io from "socket.io-client";

const socket = io("http://localhost:8000");

const ChatBox = ({ selectedUser }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const sender = localStorage.getItem("username");

  if (!sender) {
    return <div>No user found. Please log in.</div>;
  }

  useEffect(() => {
    if (selectedUser && selectedUser._id) {
      fetchMessages();
      socket.emit("join", sender);

      socket.on("receiveMessage", (message) => {
        if (
          message.sender === selectedUser._id ||
          message.recipient === selectedUser._id
        ) {
          setMessages((prev) => [...prev, message]);
        }
      });

      return () => {
        socket.off("receiveMessage");
      };
    }
  }, [selectedUser]);

  const fetchMessages = async () => {
    if (!selectedUser || !selectedUser._id) {
      console.error("Invalid selected user:", selectedUser);
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:8000/api/get?userId=${sender}&otherUserId=${selectedUser._id}`
      );
      if (!response.ok) throw new Error("Failed to fetch messages");
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = () => {
    if (input.trim() && selectedUser && selectedUser._id) {
      const message = { text: input, sender, recipient: selectedUser._id };
      socket.emit("sendMessage", message);
      setMessages((prev) => [...prev, { ...message, timestamp: new Date() }]);
      setInput("");
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length > 0 ? (
          messages.map((msg, index) => <Message key={index} {...msg} />)
        ) : (
          <p>No messages yet...</p>
        )}
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
