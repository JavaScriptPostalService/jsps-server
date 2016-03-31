'use strict';


const mongo = require('mongoose');

// This is defined in /modules/mongo/init.js
const Channel = mongo.model('Channel');

/**
 * history from a channel
 * @function history
 * @param {string} channel - the name of the channel to pull history from
 * @param {number} limit - the maximum number of payloads to pull from history
*/
const history = function(channel, limit) {
  let lookup = Channel.find({name: channel});
  lookup.findOne((err, ch) => {
    if (err) {
      console.warn('Something went wrong in writeHistory', err);
    } else {
      if (ch) {

      }
    }
  });
};

module.exports = history;
