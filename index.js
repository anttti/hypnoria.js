const express = require('express');
const uuid = require('node-uuid');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const playerIo = io.of('/player-socket');

let isPlayerConnected = false;

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/player', (req, res) => {
  res.sendFile(__dirname + '/public/player.html');
});

const MAX_CLIENTS = 1;
let clients = [];

io.on('connection', socket => {
  const id = uuid.v4();
  console.log('client', id, 'connected');

  socket.on('register-client', (msg, callback) => {
    if (clients.length >= MAX_CLIENTS) {
      // All client slots are full, let the registering client know
      callback({
        id: id,
        error: 'All slots are full! Please try again later.'
      });
    } else {
      const client = {
        id: id,
        role: 'SYNTH'
      };
      clients.push(client);
      callback(client);
      console.log('client', id, 'registered');
      console.log('clients registered:', clients);
    }
  });

  socket.on('sound-request', payload => {
    if (isPlayerConnected) {
      playerIo.emit('sound-play', payload);
    }
  });

  socket.on('disconnect', () => {
    const index = clients.findIndex(c => c.id === id);
    if (index >= 0) {
      clients.splice(index, 1);
    }
    console.log('clientId', id, 'disconnected');
    console.log('clients registered:', clients);
  });
});

// Player namespace
playerIo.on('connection', function(socket){
  console.log('Player connected');
  isPlayerConnected = true;
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});
