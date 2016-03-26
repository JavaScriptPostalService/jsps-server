'use strict';

const koa = require('koa');
const route = require('koa-route');
const websockify = require('koa-websocket');

const app = websockify(koa());

const sender = function(data) {
  try {
    return JSON.stringify(data);
  } catch (e) {
    return JSON.stringify({
      error: 'server attempted to send invalid data to client.'
    });
  }
}

// TODO: make this bettar
let channels = {};

const handlePublish = function(payload) {
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

// Save the connected socket to the subscribers under the channel with the key of client
const handleSubscribe = function(channel, payload) {
  if (!channels[channel]) {
    channels[channel] = {
      subscribers: {}
    };
  }

  channels[channel].subscribers[payload.client] = payload.socket;

  // TODO: make this actually remove the subscriber when the connection is terminated.
  payload.socket.onclose(() => {
    delete channels[channel].subscribers[payload.client];
  });
};

// Note it's app.ws.use and not app.use
app.ws.use(route.all('/ps', function* (next) {
  this.websocket.on('message', data => {
    let message = JSON.parse(data);
    switch (message.metadata.type) {
      case 'subscribe':
        handleSubscribe(message.channel, {
          client: message.metadata.client,
          socket: this.websocket
        });
        break;

      case 'publish':
        handlePublish(message);
        break;

      default:

        break;
    }
  });
  // yielding `next` will pass the context (this) on to the next ws middleware
  yield next;
}));

app.listen(3000);
