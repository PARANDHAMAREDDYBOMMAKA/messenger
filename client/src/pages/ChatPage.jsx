import React, { useState, useEffect } from "react";
import Sidebar from "../components/SideBar";
import ChatBox from "../components/ChatBox";
import Header from "../components/Header";

const ChatPage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/users");
        const data = await response.json();
        const loggedInUserId = localStorage.getItem("userId");
        const filteredUsers = data.filter(
          (user) => user._id !== loggedInUserId
        );
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar users={users} setSelectedUser={setSelectedUser} />
        {selectedUser ? (
          <ChatBox selectedUser={selectedUser} />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p>Select a user to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
