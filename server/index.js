const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});
app.use(cors())
app.use(express.static(path.join(__dirname, 'build')));


const users = {};
const votes = {};



io.on('connection', (socket) => {
  socket.on('set_username', (username) => {
    
    users[username] = {
      id: socket.id,
      user: username,
      hasVoted: false
    };
    io.emit('users', users);
  });

  socket.on('vote', ({ username, vote }) => {
    users[username].points = vote
    console.log(`${username}: ${vote}`)
    io.emit('votes', votes);
    io.emit('users', users);

  });

  socket.on('show_results', () => {
    io.emit('results', votes);
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

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../', 'index.html'));
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
