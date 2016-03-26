'use strict';

// Save the connected socket to the subscribers under the channel with the key of client
const unsubscribe = function(channel, payload, channels, cb) {
  let nch = channels;
  if (nch[channel]) {
    nch[channel].subscribers[payload.client].online = false;
    nch[channel].subscribers[payload.client].online = 'offline';
    cb(nch);
  }
};

module.exports = unsubscribe;
