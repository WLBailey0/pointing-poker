// src/PokerTable.js
import React, { useState, useEffect } from 'react';
import socket from './services/socket';

const PokerTable = ({ username }) => {
  const [vote, setVote] = useState(null);
  const [votes, setVotes] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [users, setUsers] = useState({});
  const [hasVoted, setHasVoted] = useState({});
  const [storyTitle, setStoryTitle] = useState('');

  useEffect(() => {
    socket.on('votes', (votes, show) => {
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
    });

    socket.on('story_title', (title) => setStoryTitle(title));

    socket.on('has_voted', (voted) => {
      setHasVoted(voted);
    });

    return () => {
      socket.off('votes');
      socket.off('results');
      socket.off('users');
      socket.off('clear');
      socket.off('has_voted');
      socket.off('story_title')
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
  
  const calculateUsersAverage = (users) => {
    const votes = Object.values(users)
    .filter(user => user.points !== undefined)
    .map(user => user.points);

    const totalVotes = votes.length;
    const sumVotes = votes.reduce((sum, vote) => sum + vote, 0);
    return totalVotes > 0 ? sumVotes / totalVotes : 0;
  }

  const average = calculateUsersAverage(users);

  const handleStoryTitleChange = (event) => {
    const title = event.target.value;
    setStoryTitle(title);
    socket.emit('set_story_title', title); 
  };

  return (
    <div>
      <h2>Planning Poker</h2>
      
      <h3>{username}</h3>
      <div>
        <input
          type="text"
          value={storyTitle}
          onChange={handleStoryTitleChange}
          placeholder="Enter story title"
          style={{ width: '100%', maxWidth: '1000px', padding: '8px' }}
        />
      </div>
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
            <li key={index}>{user.user} {user.points ? <span>&#x2713;</span> : ""} </li>
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
            </tbody>
          </table>
          <h4>Average: {average}</h4>
        </div>
      )}
    </div>
  );
};

export default PokerTable;
