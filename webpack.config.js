module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "./docs/bundle.js",
  },
  node: {
    fs: "empty",
  },
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
