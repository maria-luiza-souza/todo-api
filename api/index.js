const app = require('../server');
const mongoose = require('mongoose');

module.exports = async function handler(req, res) {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
  return app(req, res);
};
