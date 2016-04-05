'use strict';

const remove = require('../tools/remove');
/**
 * Deny a client access to a channel
 * @function deny
 * @param {string} channel - the channel to deny access to
 * @param {object} payload - the payload containing grant info
 * @param {object} channels - List of all channels
 * @callback {function} cb - callback to send payloads to
*/
const deny = function(channel, payload, channels, cb) {
  let nch = channels;

  let dispatcher = () => {
    // if the client is in the grant list, remove it from the grant list.
    remove(nch[channel].grant, payload.client);
    
    nch[channel].deny.push(payload.client);
    cb(nch);
  };

  if (nch[channel]) {
    if (nch[channel].secret) {
      if (payload.secret === nch[channel].secret) {
        dispatcher();
      }
    }
  }
};

module.exports = deny;
