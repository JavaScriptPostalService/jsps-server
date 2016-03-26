'use strict';
const sender = require('./sender');

const publish = function(payload, channels) {
  let channel = payload.channel;
  let data = payload.payload;
  let client = payload.metadata.client;
  let time = payload.metadata.time;

  if (!channels[channel]) {
    channels[channel] = {
      subscribers: {}
    };
  }

  let ch = channels[channel];

  Object.keys(ch.subscribers).map((value, index) => {
    // This is required because closing sockets do not yet remove them from the
    // subscribers list.
    try {
      ch.subscribers[value].send(
        sender({
          channel,
          message: data,
          metadata: {
            time
          }
        })
      );
    } catch(e) {
      console.warn(e);
    }
  });
};

module.exports = publish;
