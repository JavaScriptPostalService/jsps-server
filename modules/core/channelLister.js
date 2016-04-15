'use strict';

const config = require('../../config');
const {sender} = require('../tools');

/**
 * get a list of all channels, for administrative use
 * @function channels
 * @param {object} payload - the payload containing request
 * @param {object} socket - Socket to send channel data to
 * @param {object} channels - List of all channels
*/
const channelLister = function(payload, socket, chs) {
  let channels = JSON.parse(JSON.stringify(chs));
  if (config.adminToken) {
    if (payload.adminToken && payload.adminToken === config.adminToken) {
      Object.keys(channels).map((channel, i) => {
        delete channels[channel].subscribers;

        if (i + 1 === Object.keys(channels).length) {
          socket.send(
            sender({
              channels: channels,
              metadata: {
                time: Date.now(),
                type: 'channels',
                id: payload.metadata.id,
                requester: payload.metadata.commonName
              }
            })
          );
        }
      });
    }
  }
};

module.exports = channelLister;
