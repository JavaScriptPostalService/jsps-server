'use strict';

const mongo = require('mongoose');
mongo.connect('mongodb://localhost/catsnake');

const channel = mongo.Schema({
  registeredAt: Date,
  name: String,
  owner: String,
  privateKey: Boolean,
  payloads: Array,
  private: Boolean,
  secret: String,
  denied: Array,
  granted: Array
});

mongo.model('Channel', channel);
