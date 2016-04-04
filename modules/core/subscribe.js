'use strict';

/**
 * Subscribe to a channel or ~group~
 * @function subscribe
 * @param {string} channel - the channel to subscribe to
 * @param {object} payload - the payload containing subscription info
 * @param {object} channels - List of all channels
 * @callback {function} cb - callback to send payloads to
*/
const subscribe = function(channel, payload, channels, cb) {
  let nch = channels;

  let dispatcher = () => {
    nch[channel].subscribers[payload.client] = {
      online: true,
      status: 'active',
      commonName: payload.commonName,
      noself: (payload.noself) ? payload.noself : false,
      silent: (payload.silent) ? payload.silent : false,
      socket: payload.socket
    };

    cb(nch);
  };

  if (!nch[channel]) {
    nch[channel] = {
      privateKey: (payload.privateKey) ? payload.privateKey : false,
      secret: (payload.secret) ? payload.secret : false,
      subscribers: {}
    };
  }

  if (nch[channel].privateKey) {
    if (payload.privateKey === nch[channel].privateKey) {
      dispatcher();
    }
  } else {
    dispatcher();
  }

  // TODO: make this actually remove the subscriber when the connection is terminated.
  payload.socket.onclose(() => {
    conosle.log('closed');
    nch[channel].subscribers[payload.client].online = false;
    nch[channel].subscribers[payload.client].online = 'offline';
    cb(nch);
  });
};

module.exports = subscribe;
