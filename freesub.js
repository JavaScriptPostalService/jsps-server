'use strict';

const koa = require('koa');
const route = require('koa-route');
const websockify = require('koa-websocket');

const app = websockify(koa());

const {sender, publish, subscribe, clients} = require('./modules/core');

// TODO: make this bettar
let channels = {};

// Note it's app.ws.use and not app.use
app.ws.use(route.all('/', function* (next) {
  this.websocket.on('message', data => {
    let message = JSON.parse(data);
    switch (message.metadata.type) {
      // If a channel doesn't exist, one will be created. If a privateKey is
      // provided this will need to be passed to all publishers.
      case 'subscribe':
        subscribe(message.channel, {
          client: message.metadata.client,
          commonName: (message.metadata.commonName) ?
            message.metadata.commonName : 'Anonymous',
          privateKey: (message.privateKey) ?
            message.privateKey : false,
          socket: this.websocket
        }, channels, nch => {
          channels = Object.assign({}, channels, nch);
        });
        break;

      // TODO: make this actually work.
      // Leave a channel.
      case 'unsubscribe':
        unsubscribe(message.channel, {
          client: message.metadata.client,
          socket: this.websocket
        }, channels, nch => {
          channels = Object.assign({}, channels, nch);
        });
        break;

      // If a channel doesn't exist, nothing will be published. If a privateKey
      // is provided this will need to be passed to all publishers.
      case 'publish':
        publish(message, channels);
        break;

      case 'clients':
        clients(message, channels);
        break;

      default:

        break;
    }
  });
  // yielding `next` will pass the context (this) on to the next ws middleware
  yield next;
}));

app.listen(3000);
