const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Allow requests from your React dev server
    methods: ["GET", "POST"]
  }
});


// Needed for prod
// app.use(express.static(path.join(__dirname, 'build')));

//only dev
app.use(cors())

const rooms = {}; // To store room-specific data

io.on('connection', (socket) => {

  socket.on('join_room', ({ username, room }) => {
    if (!rooms[room]) {
      rooms[room] = { users: {}, votes: {} };
    }
    rooms[room].users[username] = {
      id: socket.id,
      user: username,
      hasVoted: false,
    };
    socket.join(room);
    io.to(room).emit('users', rooms[room].users);
  });

  socket.on('vote', ({ username, vote, room }) => {
    if (rooms[room] && rooms[room].users[username]) {
      rooms[room].users[username].points = vote;
      io.to(room).emit('users', rooms[room].users);
    }
  });

  socket.on('show_results', (room) => {
    if (rooms[room]) {
      io.to(room).emit('results', { votes: rooms[room].votes });
    }
  });

  socket.on('clear_results', (room) => {
    if (rooms[room]) {
      for (let user in rooms[room].users) {
        rooms[room].users[user].points = undefined;
      }
      io.to(room).emit('clear');
      io.to(room).emit('users', rooms[room].users);
    }
  });

  socket.on('set_story_title', ({ title, room }) => {
    if (rooms[room]) {
      io.to(room).emit('story_title', title);
    }
  });

  socket.on('disconnect', () => {
    for (let room in rooms) {
      let disconnectedUser = null;
      for (let username in rooms[room].users) {
        if (rooms[room].users[username].id === socket.id) {
          disconnectedUser = username;
          delete rooms[room].users[username];
          break;
        }
      }
      if (disconnectedUser) {
        io.to(room).emit('users', rooms[room].users);
      }
    }
  });
});
//prod 
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../', 'index.html'));
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
