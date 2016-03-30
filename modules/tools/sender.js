'use strict';

/**
 * sender to a channel
 * @function sender
 * @param {object} data - object to attempt to stringify
*/
const sender = function(data) {
  try {
    return JSON.stringify(data);
  } catch (e) {
    return JSON.stringify({
      error: 'server attempted to send invalid data to client.'
    });
  }
};

module.exports = sender;
