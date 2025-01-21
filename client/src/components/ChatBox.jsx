import React, { useState, useEffect, useRef } from "react";
import Message from "./Message";
import io from "socket.io-client";

const socket = io("http://localhost:8000");

const ChatBox = ({ selectedUser }) => {
  const [messages, setMessages] = useState([]);
  const messagesRef = useRef([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const sender = localStorage.getItem("username");
  const fileInputRef = useRef(null);

  // Typing indicator timeout
  let typingTimeout;

  const handleInputChange = (e) => {
    setInput(e.target.value);

    if (!isTyping && selectedUser) {
      socket.emit("typingStart", { recipient: selectedUser._id });
      setIsTyping(true);
    }

    if (typingTimeout) clearTimeout(typingTimeout);

    typingTimeout = setTimeout(() => {
      if (selectedUser) {
        socket.emit("typingStop", { recipient: selectedUser._id });
        setIsTyping(false);
      }
    }, 1000);
  };

  if (!sender) {
    return <div>No user found. Please log in.</div>;
  }

  const [editingMessageId, setEditingMessageId] = useState(null);
  const [showReactionPicker, setShowReactionPicker] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const [forwardMessage, setForwardMessage] = useState(null);

  const handleMessageStatusUpdate = (messageId, status) => {
    setMessages((prev) =>
      prev.map((msg) => (msg._id === messageId ? { ...msg, status } : msg))
    );
  };

  const handleReaction = (messageId, reaction) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg._id === messageId
          ? { ...msg, reactions: [...(msg.reactions || []), reaction] }
          : msg
      )
    );
  };

  const handleMessageEdit = (messageId, newText) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg._id === messageId ? { ...msg, text: newText, edited: true } : msg
      )
    );
  };

  const handleMessageDelete = (messageId) => {
    setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
  };

  useEffect(() => {
    if (selectedUser && selectedUser._id) {
      // Initial fetch
      fetchMessages();
      
      // Set up periodic fetching every second
      const interval = setInterval(fetchMessages, 1000);
      
      socket.emit("join", sender);

      socket.on("messageStatusUpdated", ({ messageId, status }) => {
        handleMessageStatusUpdate(messageId, status);
      });

      // Cleanup interval on component unmount
      return () => {
        clearInterval(interval);
        socket.off("receiveMessage");
        socket.off("messageStatusUpdated");
        socket.off("reactionAdded");
        socket.off("messageEdited");
        socket.off("messageDeleted");
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
      
      // Directly set the messages without additional sorting
      setMessages(data);
      messagesRef.current = data;
      
    } catch (error) {
      console.error("Error fetching messages:", error.message);
    }
  };

  const sendMessage = () => {
    if (input.trim() && selectedUser && selectedUser._id) {
      if (editingMessageId) {
        socket.emit("editMessage", {
          messageId: editingMessageId,
          newText: input,
          recipient: selectedUser._id,
        });
        setEditingMessageId(null);
      } else {
        const message = {
          text: input,
          sender: localStorage.getItem("username"),
          recipient: selectedUser._id,
          replyTo: replyTo?._id,
          media: [],
          isSender: true
        };
        socket.emit("sendMessage", message);
        setMessages((prev) => [
          ...prev,
          {
            ...message,
            timestamp: new Date(),
            status: "sent",
            isSender: true
          },
        ]);
      }
      setInput("");
    }
  };

  const handleMediaUpload = async (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }
      try {
        const response = await fetch("http://localhost:8000/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        console.log("Uploaded files:", data.mediaFiles);
      } catch (error) {
        console.error("Error uploading files:", error);
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 relative">
        {messages.map((msg, index) => {
          const isSender = msg.sender === localStorage.getItem("username");
          return (
            <div 
              key={index}
              className={`flex ${isSender ? "justify-end" : "justify-start"}`}
            >
              <Message 
                {...msg}
                isSender={isSender}
              />
            </div>
          );
        })}
        {typingUsers.length > 0 && (
          <div className="typing-indicator">
            {typingUsers.map((userId) => (
              <div key={userId} className="typing-bubble">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center p-4">
        <button className="p-2" onClick={() => fileInputRef.current.click()}>
          Upload
        </button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleMediaUpload}
        />
        <input
          type="text"
          className="flex-1 border p-2"
          value={input}
          onChange={handleInputChange}
          placeholder="Type a message"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatBox;
