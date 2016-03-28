'use strict';

const {sender} = require('../tools');

const clients = function(payload, channels) {
  let dispatcher = () => {
    let clients = []; // This will be populated with all users.
    let ch = channels[payload.channel];

    Object.keys(ch.subscribers).map((value, index) => {
      if (!ch.subscribers[value].silent) {
        try {
          // Let's push this client to the clients list, along with the status.
          clients.push({
            commonName: ch.subscribers[value].commonName,
            status: ch.subscribers[value].status
          });
          // If we're at the end of the online users list, send it back to the
          // requeuster with the channel requested.
          if (index + 1  === Object.keys(ch.subscribers).length) {
            ch.subscribers[payload.metadata.client].socket.send(
              sender({
                channel: payload.channel,
                clients: clients,
                metadata: {
                  time: Date.now(),
                  type: 'clients',
                  requester: payload.metadata.commonName
                }
              })
            );
          }
        } catch(e) {
          console.warn(e);
        }
      }
    });
  };

  if (channels[payload.channel]) {
    if (channels[payload.channel].privateKey) {
      if (payload.privateKey === channels[payload.channel].privateKey) {
        dispatcher();
      }
    } else {
      dispatcher();
    }
  }
};

module.exports = clients;
