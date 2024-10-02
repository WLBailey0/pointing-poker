import React, { useState } from 'react';
import socket from './services/socket';

const Login = ({ setUsername, setRoom }) => { // Accept setRoom prop
  const [name, setName] = useState('');
  const [room, setRoomName] = useState(''); // State to manage room name

  const handleSubmit = (e) => {
    e.preventDefault();
    setUsername(name);
    setRoom(room); // Set the room in App state
    socket.emit('join_room', { username: name, room }); // Emit join_room with room name
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
        <input
          type="text"
          placeholder="Enter room name"
          value={room}
          onChange={(e) => setRoomName(e.target.value)} // Set room name
        />
        <button type="submit">Join</button>
      </form>
    </div>
  );
};

export default Login;
