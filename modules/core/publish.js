'use strict';

const {sender} = require('../tools');
const {writeHistory} = require('../persistence');

/**
 * Publishes a payload to all subscribers
 * @function publish
 * @param {object} payload - the payload to publish to subscribers
 * @param {channels} object - List of all channels
*/
const publish = function(payload, channels, callback) {
  let channel = payload.channel;
  let privateKey = payload.privateKey;
  let secret = payload.secret;
  let data = payload.payload;
  let client = payload.metadata.client;
  let commonName = payload.metadata.commonName;
  let time = payload.metadata.time;

  /**
   * writeHistory to a channel
   * @function writeHistory
   * @param {string} channel - the name of the channel to write history to
   * @param {object} payload - the payload to write to history
  */
  if (channels[channel]) {
    writeHistory(channel, payload, {
      privateKey,
      secret: channels[channel].secret,
      private: channels[channel].private,
      grant: channels[channel].grant,
      deny: channels[channel].deny
    });
  }

  let next = () => {
    let ch = channels[channel];

    callback();

    Object.keys(ch.subscribers).map((value, index) => {
      // This is required because closing sockets do not yet remove them from the
      // subscribers list.
      try {
        if (ch.subscribers[value].online) {
          if (ch.subscribers[value].noself && client === value) {
            // Looks like we're setup to ignore payloads sent by ourselves.
          } else {
            if (!ch.subscribers[value].silent) {
              ch.subscribers[value].socket.send(
                sender({
                  channel,
                  message: data,
                  metadata: {
                    time,
                    type: 'publish',
                    id: payload.metadata.id,
                    sender: commonName
                  }
                })
              );
            }
          }
        }
      } catch(e) {
        console.warn(e);
      }
    });
  };

  if (channels[channel]) {
    // If the channel has a private key...
    if (channels[channel].privateKey) {
      // ...make sure the provided key matches
      if (privateKey === channels[channel].privateKey) {
        // If the channel is invite only...
        if (channels[channel].private) {
          // ...make sure the client is on the granted list
          if (channels[channel].grant.indexOf(client) > -1) {
            next();
          }
        } else {
          // make sure the user is not blocked from this channel
          if (channels[channel].deny.indexOf(client) === -1) {
            next();
          }
        }
      }
    } else if (channels[channel].private) {
      // ...make sure the client is on the granted list
      if (channels[channel].grant.indexOf(client) > -1) {
        next();
      }
    } else {
      // make sure the user is not blocked from this channel
      if (channels[channel].deny.indexOf(client) === -1) {
        next();
      }
    }
  }
};

module.exports = publish;
