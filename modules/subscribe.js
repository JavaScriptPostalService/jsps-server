'use strict';

// Save the connected socket to the subscribers under the channel with the key of client
const subscribe = function(channel, payload, channels, cb) {
  let nch = channels;
  if (!nch[channel]) {
    nch[channel] = {
      subscribers: {}
    };
  }

  nch[channel].subscribers[payload.client] = payload.socket;

  cb(nch);

  // TODO: make this actually remove the subscriber when the connection is terminated.
  payload.socket.onclose(() => {
    delete nch[channel].subscribers[payload.client];
    cb(nch);
  });
};

module.exports = subscribe;
