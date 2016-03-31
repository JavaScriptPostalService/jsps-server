'use strict';

/**
 * history from a channel
 * @function history
 * @param {string} channel - the name of the channel to pull history from
 * @param {number} limit - the maximum number of payloads to pull from history
*/
const history = function(channel, limit, privateKey, channels, client) {

  const mongo = require('mongoose');
  // This is defined in /modules/mongo/init.js
  const Channel = mongo.model('Channel');

  const message = require('../core/message');

  let lookup = Channel.find({name: channel});
  lookup.findOne((err, ch) => {
    if (err) {
      console.warn('Something went wrong in writeHistory', err);
    } else {
      if (ch) {
        let send = (pk) => {
          message({
            history: ch.payloads.slice(-limit),
            privateKey: (pk) ? pk : false,
            channel: channel,
            metadata: {
              time: Date.now(),
              requester: client,
              type: 'history'
            }
          }, channels);
        };

        if (ch.privateKey) {
          if (privateKey === ch.privateKey) {
            send(privateKey);
          }
        } else {
          send();
        }
      }
    }
  });
};

module.exports = history;
