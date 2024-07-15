// src/PokerTable.js
import React, { useState, useEffect } from 'react';
import socket from './services/socket';

const PokerTable = ({ username }) => {
  const [vote, setVote] = useState(null);
  const [votes, setVotes] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [users, setUsers] = useState({});
  const [hasVoted, setHasVoted] = useState({});

  useEffect(() => {
    socket.on('votes', (votes) => {
      setVotes(votes);
    });

    socket.on('results', (data) => {
      setVotes(data.votes);
      setShowResults(true);
    });

    socket.on('users', (users) => {
      setUsers(users);
    });

    socket.on('clear', () => {
      setVotes(null);
      setShowResults(false)
      setHasVoted({})
    })

    socket.on('has_voted', (voted) => {
      setHasVoted(voted);
    });

    return () => {
      socket.off('votes');
      socket.off('results');
      socket.off('users');
      socket.off('clear');
      socket.off('has_voted');
    };
  }, []);

  const handleVote = (value) => {
    setVote(value);
    socket.emit('vote', { username, vote: value });
  };

  const handleShowResults = () => {
    socket.emit('show_results');
  };

  const handleClearResults = () => {
    socket.emit('clear_results')
  }



  return (
    <div>
      <h2>Planning Poker</h2>
      
      <h3>{username}</h3>
      <div>
        <button onClick={() => handleVote(1)}>1</button> 
        <button onClick={() => handleVote(2)}>2</button>
        <button onClick={() => handleVote(3)}>3</button>
        <button onClick={() => handleVote(5)}>5</button>
        <button onClick={() => handleVote(8)}>8</button>
        <button onClick={() => handleVote(13)}>13</button>
      </div>
      <button onClick={handleShowResults}>Show Results</button>
      <button onClick={handleClearResults}>Clear Results</button>
      <div>
        <h3>Users in the session</h3>
        
        <ul>
          {Object.values(users).map((user, index) => (
            
            <li key={index}>{user.user} {user.points ? <span>&#x2713;</span> : ""}</li>
          ))}
        </ul>
      </div>
      {showResults && (
        <div>
          <h3>Results</h3>
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Vote</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(users).map((user, vote) => (
                <tr key={vote}>
                  <td>{user.user}</td>
                  <td>{user.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h4>Average: {Object.values(votes).reduce((a, b) => a + b, 0) / Object.values(votes).length}</h4>
        </div>
      )}
    </div>
  );
};

export default PokerTable;
