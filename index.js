const Immutable = require('immutable');
const express = require('express');
const uuid = require('node-uuid');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const playerIo = io.of('/player-socket');

const Clients = require('./clients');

let clients = Immutable.List();
let isPlayerConnected = false;

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/player', (req, res) => {
  res.sendFile(__dirname + '/public/player.html');
});

io.on('connection', socket => {
  const id = uuid.v4();
  console.log('client', id, 'connected');

  socket.on('register-client', (msg, callback) => {
    if (!Clients.canAddClient(clients)) {
      // All client slots are full, let the registering client know
      callback({
        id: id,
        error: 'All slots are full! Please try again later.'
      });
      console.log('client', id, 'registration rejected: slots full');
    } else {
      const res = Clients.addClient(clients, id);
      clients = res.clients;
      callback(res.client.toJS());
    }
  });

  socket.on('sound-request', payload => {
    if (isPlayerConnected) {
      playerIo.emit('sound-play', payload);
      clients = Clients.updateLastEventTime(clients, id);
    }
  });

  socket.on('heartbeat', id => {
    clients = Clients.updateLastEventTime(clients, id);
  });

  socket.on('disconnect', () => {
    clients = Clients.removeClient(clients, id);
    console.log('clientId', id, 'disconnected');
  });
});

// Player namespace
playerIo.on('connection', socket => {
  console.log('Player connected');
  isPlayerConnected = true;
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});

setInterval(() => {
  clients = Clients.removeStaleClients(clients);
}, 1000);
