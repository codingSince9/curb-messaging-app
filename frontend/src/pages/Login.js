import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [channelName, setChannelName] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    fetch("http://localhost:8000/login", {
      method: "POST",
      body: JSON.stringify({ username }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        navigate("messaging/", { state: {userId: data.userId} });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleCreateNewChannel = () => {
    fetch("http://localhost:8000/channel", {
      method: "POST",
      body: JSON.stringify({ channelName }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error("Error:", error);
      });
    setChannelName("");
  }

  return (
    <div className="login-container">
      <div className="login">
        <h1>Login</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={handleLogin}>Log In</button>
      </div>
      <div className="new-channel">
        <h1>Create a new messaging channel</h1>
        <input
          type="text"
          placeholder="Channel Name"
          value={channelName}
          onChange={(e) => setChannelName(e.target.value)}
        />
        <button onClick={handleCreateNewChannel}>Create</button>
      </div>
    </div>
  );
};

export default Login;
