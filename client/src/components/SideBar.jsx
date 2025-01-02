import React from "react";

const Sidebar = ({ users, setSelectedUser }) => {
  const loggedInUserId = localStorage.getItem("username");

  const filteredUsers = users.filter((user) => user.username !== loggedInUserId);
  // console.log("filtered",filteredUsers)

  return (
    <div className="w-1/3 bg-gray-200 p-4">
      <h2 className="font-bold text-xl">Users</h2>
      <ul>
        {filteredUsers.map((user) => (
          <li
            key={user._id}
            className="cursor-pointer py-2 hover:bg-gray-300"
            onClick={() => setSelectedUser(user)}
          >
            {user.username}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
