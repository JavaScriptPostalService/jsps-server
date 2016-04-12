'use strict';

const config = require('./config');

require('./modules/mongo/init.js');

const koa = require('koa');
const route = require('koa-route');
const websockify = require('koa-websocket');

const app = websockify(koa());

const {
  publish,
  subscribe,
  unsubscribe,
  info,
  channelLoader
} = require('./modules/core');

const {sender} = require('./modules/tools');

const msgpack = require("msgpack-lite");

const {history} = require('./modules/persistence');

// TODO: this should be loaded from the DB instead, right now all channels are
// lost on each restart / crash of catsnake-server
let channels = {};
let trustedClients = [];

channelLoader(ch => {
  channels = ch

  // Note it's app.ws.use and not app.use
  app.ws.use(route.all('/', function* (next) {
    this.websocket.on('message', data => {
      let message = msgpack.decode(data);

      const pass = () => {
        switch (message.metadata.type) {

          case 'subscribe':
            /**
             * Subscribe to a channel or ~group~
             * @function subscribe
             * @param {string} channel - the channel to subscribe to
             * @param {object} payload - the payload containing subscription info
             * @param {object} channels - List of all channels
             * @callback {function} cb - callback to send payloads to
            */
            subscribe(message.channel, {
              client: message.metadata.client,
              commonName: (message.metadata.commonName) ?
                message.metadata.commonName : 'Anonymous',
              privateKey: (message.privateKey) ?
                message.privateKey : false,
              secret: (message.secret) ?
                message.secret : false,
              noself: (message.noself) ?
                message.noself : false,
              silent: (message.silent) ?
                message.silent : false,
              private: (message.private) ?
                message.private : false,
              socket: this.websocket
            }, channels, nch => {
              channels = Object.assign({}, channels, nch);
            });
            break;

          case 'unsubscribe':
            /**
             * Unsubscribe from a channel or ~group~
             * @function unsubscribe
             * @param {string} channel - the channel to unsubscribe from
             * @param {object} payload - the payload containing subscription info
             * @param {channels} object - List of all channels
             * @callback {function} cb - callback to send confirmation to
            */
            unsubscribe(message.channel, {
              client: message.metadata.client,
              socket: this.websocket
            }, channels, nch => {
              channels = Object.assign({}, channels, nch);
            });
            break;

          case 'publish':
            /**
             * Publishes a payload to all subscribers
             * @function publish
             * @param {object} payload - the payload to publish to subscribers
             * @param {channels} object - List of all channels
            */
            publish(message, channels, () => {
              /* Disabled for now, will make a config value for immediate response
               * the current method sends an extra message just to verify, this is slow
              this.websocket.send(
                sender({
                  helper: true,
                  metadata: {
                    type: 'helper',
                    id: message.metadata.id
                  }
                })
              );
              */
            });
            break;

          case 'info':
            /**
             * info about a channel or ~group~
             * @function info
             * @param {object} payload - the payload containing subscription info
             * @param {object} channels - List of all channels
             * @callback {function} cb - callback to send confirmation to
            */
            info(message, channels);
            break;

          case 'history':
            /**
             * history from a channel
             * @function history
             * @param {string} channel - the name of the channel to pull history from
             * @param {number} limit - the maximum number of payloads to pull from history
            */
            history(
              message.channel,
              message.limit,
              message.privateKey,
              channels,
              message.metadata.client
            );
            break;

          default:

            break;
        }
      }

      // Ensure the client is trusted.
      if (config.secret) {
        // If the user is already trusted, let them continue.
        if (trustedClients.indexOf(message.metadata.client) > -1) {
          pass();
        // If the user is not trusted, see if they are trying to authorize.
      } else if(message.metadata.type === 'authenticate') {
          // Now that we know they are trying to authorize, see if the secret
          // matches the secret in the config.
          if (message.metadata.secret === config.secret) {
            // Cool, all is well, the next request they make will be allowed.
            trustedClients.push(message.metadata.client);
          }
        }
      } else {
        // Privacy is not enabled on this catsnake server, continue on your way.
        pass();
      }
    });
    // yielding `next` will pass the context (this) on to the next ws middleware
    yield next;
  }));
});

app.listen(3081);
