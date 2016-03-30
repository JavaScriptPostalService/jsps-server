'use strict';

/**
 * Unsubscribe from a channel or ~group~
 * @function unsubscribe
 * @param {string} channel - the channel to unsubscribe from
 * @param {object} payload - the payload containing subscription info
 * @param {channels} object - List of all channels
 * @callback {function} cb - callback to send confirmation to
*/
const unsubscribe = function(channel, payload, channels, cb) {
  let nch = channels;
  if (nch[channel]) {
    delete nch[channel].subscribers[payload.client];
    cb(nch);
  }
};

module.exports = unsubscribe;
