const io = require('socket.io-client');
const Hammer = require('hammerjs');
const Dom = require('./dom-helpers');
const instruments = require('./instruments');
const socket = io();

Dom.disableiOS10Pinch();

socket.on('connect', () => {
  socket.emit('register-client', 'client', result => {
    if (result.error) {
      console.log(result.error);
      Dom.show('.error', result.error);
    } else {
      console.log('my id is', result.id, 'type', result.type);
      Dom.showAll('.' + result.type);
      instruments[result.type](socket);
      setInterval(() => {
        socket.emit('heartbeat', result.id);
      }, 500);
    }
  });
});
