'use strict';

const mongo = require('mongoose');
mongo.connect('mongodb://localhost/catsnake');

const channel = mongo.Schema({
  registeredAt: Date,
  name: String,
  privateKey: Boolean,
  payloads: Array
});

mongoose.model('Channel', channel);
