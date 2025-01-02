import React from "react";

const Message = ({ text, sender, timestamp }) => {
  const isSender = sender === localStorage.getItem("username");

  return (
    <div className={`flex ${isSender ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`p-2 max-w-xs rounded-lg ${
          isSender ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
      >
        <p>{text}</p>
        <span className="text-xs text-gray-500">
          {new Date(timestamp).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
};

export default Message;
