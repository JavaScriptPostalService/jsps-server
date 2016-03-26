'use strict';

const koa = require('koa');
const route = require('koa-route');
const websockify = require('koa-websocket');

const app = websockify(koa());

const {sender, publish, subscribe} = require('./modules/core');

// TODO: make this bettar
let channels = {};

// Note it's app.ws.use and not app.use
app.ws.use(route.all('/', function* (next) {
  this.websocket.on('message', data => {
    let message = JSON.parse(data);
    switch (message.metadata.type) {
      case 'subscribe':
        subscribe(message.channel, {
          client: message.metadata.client,
          privateKey: (message.privateKey) ? message.privateKey : false,
          socket: this.websocket
        }, channels, nch => {
          channels = Object.assign({}, channels, nch);
        });
        break;

      case 'unsubscribe':
        unsubscribe(message.channel, {
          client: message.metadata.client,
          socket: this.websocket
        }, channels, nch => {
          channels = Object.assign({}, channels, nch);
        });
        break;

      case 'publish':
        publish(message, channels);
        break;

      default:

        break;
    }
  });
  // yielding `next` will pass the context (this) on to the next ws middleware
  yield next;
}));

app.listen(3000);
