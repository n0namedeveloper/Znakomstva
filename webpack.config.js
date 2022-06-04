const path = require('path');

module.exports = {
  mode: 'development',
  entry: './server.js',
  output: {
    path: path.resolve(__dirname, 'js'),
    filename: 'index.js',
  },
};