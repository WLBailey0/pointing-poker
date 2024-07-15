// src/Login.js
import React, { useState } from 'react';
import socket from './services/socket';

const Login = ({ setUsername }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setUsername(name);
    socket.emit('set_username', name);
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">Join</button>
      </form>
    </div>
  );
};

export default Login;
