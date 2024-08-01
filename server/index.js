const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, '../client/build')));


const users = {};
const votes = {};



io.on('connection', (socket) => {
  socket.on('set_username', (username) => {
    
    users[username] = {
      id: socket.id,
      user: username,
      hasVoted: false
    };
    console.log(users)
    io.emit('users', users);
  });

  socket.on('vote', ({ username, vote }) => {
    users[username].points = vote
    // votes[username] = vote;
    io.emit('votes', votes);
    io.emit('users', users);
    console.log(username + ": " + vote);

  });

  socket.on('show_results', () => {
    io.emit('results', { votes });
    console.log("show results clicked");
  });

  socket.on('clear_results', () => {
    for (let user in users) {
      users[user].points = undefined;
    }
    io.emit('clear');
    io.emit('users', users);
  });

  socket.on('set_story_title', (title) => {
    let currentStoryTitle = title;
    io.emit('story_title', currentStoryTitle);
  });

  socket.on('disconnect', () => {
    let disconnectedUser = null;
    for (let username in users) {
      if (users[username].id === socket.id) {
        disconnectedUser = username;
        break;
      }
    }

    if (disconnectedUser) {
      delete users[disconnectedUser];
      io.emit('users', Object.values(users));
    }  

  });
});


app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
