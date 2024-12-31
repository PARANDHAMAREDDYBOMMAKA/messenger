import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/login",
        {
          username,
          password,
        }
      );
      localStorage.setItem("username", response.data.username);
      window.location.href = "/chat";
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md w-1/3">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />
      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white w-full py-2 rounded"
      >
        Login
      </button>
      <div className="mt-4 text-center">
        <p>
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
