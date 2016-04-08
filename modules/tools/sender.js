'use strict';

const msgpack = require("msgpack-lite");

/**
 * sender to a channel
 * @function sender
 * @param {object} data - object to attempt to stringify
*/
const sender = function(data) {
  try {
    return JSON.stringify(data);
//    return msgpack.encode(data);
  } catch (e) {
    return JSON.stringify({
      error: 'server attempted to send invalid data to client.'
    });
  }
};

module.exports = sender;
