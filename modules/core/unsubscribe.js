'use strict';

// Save the connected socket to the subscribers under the channel with the key of client
const unsubscribe = function(channel, payload, channels, cb) {
  let nch = channels;
  if (nch[channel]) {
    delete nch[channel].subscribers[payload.client];
    cb(nch);
  }
};

module.exports = unsubscribe;
