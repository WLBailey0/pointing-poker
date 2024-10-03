const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, '../client/build')));

const rooms = {}; 

io.on('connection', (socket) => {

  socket.on('join_room', ({ username, room }) => {
    try{
    
      if (!rooms[room]) {
        rooms[room] = {
          users: {},
          votes: {},
        };
      }

    
      rooms[room].users[username] = {
        id: socket.id,
        user: username,
        hasVoted: false,
      };

    
      socket.join(room);

    
      io.to(room).emit('users', rooms[room].users);
      console.log(`User ${username} joined room: ${room}`);
    } catch (err) {
        console.log(`Error in join_room ${err}`)
    }
  });

  socket.on('vote', ({ username, vote, room }) => {
    try {
      const roomData = rooms[room];
      if (roomData && roomData.users[username]) {
        roomData.users[username].points = vote;
        io.to(room).emit('votes', roomData.votes);
        io.to(room).emit('users', roomData.users);
      }
    } catch (err) {
      console.error(`Error in vote: ${err}`);
    }
  });

  socket.on('show_results', (room) => {
    try {
      const roomData = rooms[room];
      if (roomData) {
        io.to(room).emit('results', { votes: roomData.votes });
      }
    } catch (err) {
      console.error(`Error in show results: ${err}`);
    }
  });

  socket.on('clear_results', (room) => {
    try {
      const roomData = rooms[room];
      if (roomData) {
        for (let user in roomData.users) {
          roomData.users[user].points = undefined;
        }
        io.to(room).emit('clear');
        io.to(room).emit('users', roomData.users);
      }
    } catch (err) {
      console.error(`Error in clear results: ${err}`);
    }
  });

  socket.on('set_story_title', ({ title, room }) => {
    try {
      io.to(room).emit('story_title', title);
    } catch (err) {
      console.log(`Error setting story title: ${err}`);
    }
  });

  socket.on('leave_room', ({ username, room }) => {
    try {
      const roomData = rooms[room];
      if (roomData && roomData.users[username]) {
        delete roomData.users[username];
        socket.leave(room);
        io.to(room).emit('users', roomData.users);
        console.log(`User ${username} left room: ${room}`);
      }
    } catch (err) {
      console.error("Error in leave_room");
    }
  });

  socket.on('disconnect', () => {
    try {
      for (let room in rooms) {
        for (let username in rooms[room].users) {
          if (rooms[room].users[username].id === socket.id) {
            delete rooms[room].users[username];
            io.to(room).emit('users', rooms[room].users);
            console.log(`User ${username} disconnected from room: ${room}`);
            break;
          }
        }
      }
    } catch (err) {
      console.error("Error in disconnect");
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

