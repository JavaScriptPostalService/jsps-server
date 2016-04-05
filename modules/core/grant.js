'use strict';

const remove = require('../tools/remove');

/**
 * Grant a client access to a channel
 * @function grant
 * @param {string} channel - the channel to grant access to
 * @param {object} payload - the payload containing grant info
 * @param {object} channels - List of all channels
 * @callback {function} cb - callback to send payloads to
*/
const grant = function(channel, payload, channels, cb) {
  let nch = channels;

  let dispatcher = () => {
    // if the client is in the deny list, remove it from the deny list.
    remove(nch[channel].deny, payload.client);
    
    nch[channel].grant.push(payload.client);
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

module.exports = grant;
