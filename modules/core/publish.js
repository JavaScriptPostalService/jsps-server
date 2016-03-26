'use strict';
const sender = require('./sender');

const publish = function(payload, channels) {
  let channel = payload.channel;
  let privateKey = payload.privateKey;
  let data = payload.payload;
  let client = payload.metadata.client;
  let commonName = payload.metadata.commonName;
  let time = payload.metadata.time;

  let next = () => {
    let ch = channels[channel];

    Object.keys(ch.subscribers).map((value, index) => {
      // This is required because closing sockets do not yet remove them from the
      // subscribers list.
      try {
        if (ch.subscribers[value].online) {
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
};

module.exports = publish;
