const webpack = require('webpack');
const MinifyPlugin = require("babel-minify-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "./docs/bundle.js",
  },
  node: {
    fs: "empty",
  },
  plugins: [
    new webpack.DefinePlugin({ "process.env": { NODE_ENV: "'production'" } }),
    new MinifyPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: { loader: "babel-loader" },
      },
      {
        test: /\.sass$/,
        exclude: /node_modules/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
          { loader: "sass-loader" }
        ],
      },
    ],
  },
};
