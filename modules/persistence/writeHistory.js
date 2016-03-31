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
const writeHistory = function(channel, payload, privateKey) {
  // should write the payload to the database, payload contains data like the
  // message, who sent it, and more. channel is channel obviously.
};

module.exports = writeHistory;
