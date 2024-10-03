import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import PokerTable from './PokerTable';
import './App.css'

const App = () => {
  const [username, setUsername] = useState('');

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element = {username ? <PokerTable username={username} /> : <Login setUsername={setUsername} />}>
          </Route>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
