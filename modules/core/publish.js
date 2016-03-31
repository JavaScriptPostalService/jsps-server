'use strict';

const {sender} = require('../tools');
const {writeHistory} = require('../persistence');

/**
 * Publishes a payload to all subscribers
 * @function publish
 * @param {object} payload - the payload to publish to subscribers
 * @param {channels} object - List of all channels
*/
const publish = function(payload, channels, privateMessage) {
  // This section is for private messaging, here we can target a specific
  // subscriber for sending stuff like history.
  if (privateMessage) {
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

  } else {
    let channel = payload.channel;
    let privateKey = payload.privateKey;
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
    writeHistory(channel, payload, privateKey);

    let next = () => {
      let ch = channels[channel];

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
      if (channels[channel].privateKey) {
        if (privateKey === channels[channel].privateKey) {
          next();
        }
      } else {
        next();
      }
    }
  }
};

module.exports = publish;
