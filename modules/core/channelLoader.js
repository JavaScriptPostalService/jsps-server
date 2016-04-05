'use strict';

/**
 * Check the database for channels, load them up in the server before going any futher.
 * @function channelLoader
 * @callback {funciton} callback - the channels object
*/
const channelLoader = function(callback) {

  const mongo = require('mongoose');
  // This is defined in /modules/mongo/init.js
  const Channel = mongo.model('Channel');

  const message = require('../core/message');

  let lookup = Channel.find();
  lookup.find((err, chs) => {
    if (err) {
      console.warn('Something went wrong in writeHistory', err);
    } else {
      if (chs.length) {
        let channels = {};
        chs.map((ch, i) => {
          channels[ch.name] = {
            privateKey: ch.privateKey,
            private: ch.private,
            secret: ch.secret,
            grant: ch.grant,
            deny: ch.deny,
            subscribers: []
          }
          if (i + 1 === chs.length) {
            callback(channels)
          }
        });
      } else {
        callback({});
      }
    }
  });
};

module.exports = channelLoader;
