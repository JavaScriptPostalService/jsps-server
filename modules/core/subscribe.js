'use strict';

// Save the connected socket to the subscribers under the channel with the key of client
const subscribe = function(channel, payload, channels, cb) {
  let nch = channels;

  let dispatcher = () => {
    nch[channel].subscribers[payload.client] = {
      online: true,
      status: 'active',
      commonName: payload.commonName,
      socket: payload.socket
    };

    cb(nch);
  };

  if (payload.privateKey && !nch[channel]) {
    nch[channel] = {
      privateKey: payload.privateKey,
      subscribers: {}
    };
  } else if (!nch[channel]) {
    nch[channel] = {
      subscribers: {}
    };
  }


  if (nch[channel].privateKey) {
    if (payload.privateKey === nch[channel].privateKey) {
      dispatcher();
    }
  } else {
    dispatcher();
  }

  // TODO: make this actually remove the subscriber when the connection is terminated.
  payload.socket.onclose(() => {
    conosle.log('closed');
    nch[channel].subscribers[payload.client].online = false;
    nch[channel].subscribers[payload.client].online = 'offline';
    cb(nch);
  });
};

module.exports = subscribe;
