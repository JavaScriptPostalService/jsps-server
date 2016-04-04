'use strict';

const mongo = require('mongoose');

// This is defined in /modules/mongo/init.js
const Channel = mongo.model('Channel');

/**
 * writeHistory to a channel
 * @function writeHistory
 * @param {string} channel - the name of the channel to write history to
 * @param {object} payload - the payload to write to history
*/
const writeHistory = function(channel, payload, opts) {
  let lookup = Channel.find({name: channel});
  lookup.findOne((err, ch) => {
    if (err) {
      console.warn('Something went wrong in writeHistory', err);
    }

    if (ch) {
      if (ch.privateKey) {
        if (opts.privateKey === ch.privateKey) {
          ch.payloads.push(payload);
          ch.save(err => {
            if (err) {
              console.warn('Something went wrong in writeHistory', err);
            }
          });
        }
      } else {
        ch.payloads.push(payload);
        ch.save(err => {
          if (err) {
            console.warn('Something went wrong in writeHistory', err);
          }
        });
      }
    } else {
      let hist = new Channel({
        registeredAt: Date.now(),
        owner: payload.metadata.client,
        name: channel,
        privateKey: (opts.privateKey) ? opts.privateKey : false,
        secret: (opts.secret) ? opts.secret : false,
        payloads: [payload]
      });
      hist.save(err => {
        if (err) {
          console.warn('Something went wrong in writeHistory', err);
        }
      });
    }
  });
};

module.exports = writeHistory;
