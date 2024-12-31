import React from "react";

const Message = ({ sender, text, timestamp }) => {
  return (
    <div className="mb-2">
      <strong>{sender}:</strong> {text}
      <div className="text-xs text-gray-500">
        {new Date(timestamp).toLocaleTimeString()}
      </div>
    </div>
  );
};

export default Message;
