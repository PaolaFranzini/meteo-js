const Dotenv = require('dotenv-webpack');
const path = require('path');
 
const config = {
  mode: "development",
  entry: './js/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  plugins: [
    new Dotenv()
  ]
};

module.exports = config;