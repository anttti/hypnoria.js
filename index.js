const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/player', (req, res) => {
  res.sendFile(__dirname + '/public/player.html');
});

io.on('connection', socket => {
  socket.on('sound-request', payload => {
    io.emit('sound-play', payload);
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});
