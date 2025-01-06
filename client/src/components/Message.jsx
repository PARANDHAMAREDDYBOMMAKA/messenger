import React, { useState } from "react";

const REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "👏"];

const Message = (props) => {
  const { 
    text, 
    sender, 
    timestamp, 
    reactions = [], 
    media = [],
    replyTo,
    forwarded,
    onReactionClick,
    onEditClick,
    onDeleteClick,
    onForwardClick,
    isEditing,
    className,
    isSender
  } = props;
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [showReactions, setShowReactions] = useState(false);

  const handleContextMenu = (e) => {
    e.preventDefault();
    setShowContextMenu(true);
  };

  const handleReactionSelect = (reaction) => {
    onReactionClick(reaction);
    setShowReactions(false);
  };

  return (
    <div 
      className="mb-4 relative"
      onContextMenu={handleContextMenu}
    >
      <div
        className={`p-2 max-w-xs rounded-lg relative ${
          isSender ? "bg-green-100" : "bg-gray-200"
        } ${className}`}
      >
        {isEditing && (
          <div className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
            Editing
          </div>
        )}
        {/* Reply preview */}
        {replyTo && (
          <div className="mb-2 p-2 bg-black/10 rounded-lg">
            <p className="text-sm truncate">{replyTo.text}</p>
            {replyTo.media?.length > 0 && (
              <div className="mt-1">
                {replyTo.media[0].type === 'image' && (
                  <img 
                    src={replyTo.media[0].url} 
                    alt="Reply preview" 
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
              </div>
            )}
          </div>
        )}

        {/* Forwarded label */}
        {forwarded && (
          <div className="text-xs mb-1 opacity-75">Forwarded</div>
        )}

        {/* Message text */}
        {text && <p>{text}</p>}

        {/* Media attachments */}
        {media.length > 0 && (
          <div className="mt-2 space-y-2">
            {media.map((file, index) => (
              <div key={index}>
                {file.type === 'image' && (
                  <img
                    src={file.url}
                    alt="Media"
                    className="max-w-full h-auto rounded-lg"
                  />
                )}
                {file.type === 'video' && (
                  <video
                    controls
                    className="max-w-full h-auto rounded-lg"
                  >
                    <source src={file.url} type="video/mp4" />
                  </video>
                )}
                {file.type === 'document' && (
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-2 bg-black/10 rounded-lg"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span className="truncate">{file.fileName}</span>
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Reactions */}
        {reactions.length > 0 && (
          <div className="flex gap-1 mt-1">
            {reactions.map((reaction, index) => (
              <span key={index} className="text-sm">
                {reaction.type}
              </span>
            ))}
          </div>
        )}

        {/* Timestamp and status */}
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-gray-500">
            {new Date(timestamp).toLocaleTimeString()}
          </span>
        </div>

        {/* Reaction picker */}
        {showReactions && (
          <div className="absolute -bottom-8 left-0 bg-white rounded-full shadow-lg p-1 flex gap-1">
            {REACTIONS.map((reaction, index) => (
              <button
                key={index}
                className="hover:scale-125 transition-transform"
                onClick={() => handleReactionSelect(reaction)}
              >
                {reaction}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Context menu */}
      {showContextMenu && (
        <div className="absolute bg-white shadow-lg rounded-md p-2 z-10">
          {isSender && (
            <>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => {
                  onEditClick();
                  setShowContextMenu(false);
                }}
              >
                Edit
              </button>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                onClick={() => {
                  onDeleteClick();
                  setShowContextMenu(false);
                }}
              >
                Delete
              </button>
            </>
          )}
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => {
                  onForwardClick();
                  setShowContextMenu(false);
                }}
              >
                Forward
              </button>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => {
                  onReplyClick();
                  setShowContextMenu(false);
                }}
              >
                Reply
              </button>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => {
                  setShowReactions(true);
                  setShowContextMenu(false);
                }}
              >
                Add Reaction
              </button>
        </div>
      )}
    </div>
  );
};

export default Message;
