const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

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
    console.log(users)
    io.emit('users', users);
  });

  socket.on('vote', ({ username, vote }) => {
    users[username].points = vote
    // votes[username] = vote;
    io.emit('votes', votes);
    io.emit('users', users);

  });

  socket.on('show_results', () => {
    io.emit('results', { votes });
  });

  socket.on('clear_results', () => {
    for (let user in users) {
      users[user].points = undefined;
    }
    io.emit('clear');
    io.emit('users', users);
  });

  socket.on('disconnect', () => {
    delete users[socket.id];
    delete votes[socket.id];
    io.emit('users', users);
    io.emit('votes', votes);
  });
});

//prod 
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../', 'index.html'));
});

const PORT = process.env.PORT || 80;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
