import React from "react";
import Sidebar from "../components/SideBar";
import ChatBox from "../components/ChatBox";
import Header from "../components/Header";

const ChatPage = () => {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <ChatBox />
      </div>
    </div>
  );
};

export default ChatPage;
