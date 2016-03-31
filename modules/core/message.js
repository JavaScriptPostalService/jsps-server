'use strict';

const {sender} = require('../tools');
const {writeHistory} = require('../persistence');

/**
 * Publishes a payload to one subscriber
 * @function message
 * @param {object} payload - the payload to publish to subscribers
 * @param {channels} object - List of all channels
*/
const message = function(payload, channels) {
  let client = payload.metadata.requester;
  let channel = payload.channel;
  let privateKey = payload.privateKey;

  let next = () => {
    let ch = channels[channel];

    let reuqester = ch.subscribers[client];
    if (reuqester) {
      // This is required because closing sockets do not yet remove them from the
      // subscribers list.
      try {
        if (reuqester.online) {
          if (reuqester.noself && client === value) {
            // Looks like we're setup to ignore payloads sent by ourselves.
          } else {
            if (!reuqester.silent) {
              reuqester.socket.send(
                // Break away from formatting the payload, we expect this to
                // be done by the issuer of the private message.
                sender(payload)
              );
            }
          }
        }
      } catch(e) {
        console.warn(e);
      }
    }
  };

  if (channels[channel]) {
    if (channels[channel].privateKey) {
      if (privateKey === channels[channel].privateKey) {
        next();
      }
    } else {
      next();
    }
  }
};

module.exports = message;
