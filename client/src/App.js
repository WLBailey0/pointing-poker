import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import PokerTable from './PokerTable';
import './App.css'

const App = () => {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState(''); // Add room state

  return (
    <Router>
      <div>
        <Routes>
          <Route 
            path="/" 
            element={
              username && room ? (
                <PokerTable username={username} room={room} />
              ) : (
                <Login setUsername={setUsername} setRoom={setRoom} /> // Pass setRoom to Login
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;