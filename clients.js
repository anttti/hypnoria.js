const Immutable = require('immutable');

const STALE_TIMEOUT = 2000;
const CLIENT_TYPES = ['SYNTH', 'DRUMS'];
const MAX_CLIENTS = CLIENT_TYPES.length;

const canAddClient = (clients) => {
  return clients.size < MAX_CLIENTS;
}

const addClient = (clients, id) => {
  const client = Immutable.Map({
    id: id,
    type: CLIENT_TYPES[clients.size],
    lastEventTime: new Date().getTime()
  });
  console.log('client', {
    id: id,
    type: CLIENT_TYPES[clients.size],
    lastEventTime: new Date().getTime()
  }, 'registration successful');
  return {
    clients: clients.push(client),
    client: client
  };
}

const updateLastEventTime = (clients, id) => {
  const index = clients.findIndex(c => c.get('id') === id);
  if (index >= 0) {
    const client = clients.get(index);
    return clients.set(index, client.set('lastEventTime', new Date().getTime()));
  }
  return clients;
};

const removeClient = (clients, id) => {
  return clients.filter(c => c.get('id') !== id);
};

const removeStaleClients = (clients) => {
  const now = new Date().getTime();
  const aliveClients = clients.filter(c => now - c.get('lastEventTime') < STALE_TIMEOUT);
  console.log('removing stale clients, before:', clients.size, 'after:', aliveClients.size);
  return aliveClients;
};

module.exports = {
  addClient,
  removeClient,
  removeStaleClients,
  updateLastEventTime,
  canAddClient
}