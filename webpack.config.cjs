const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/index.ts",
  target: "node",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    filename: "index.min.cjs",
    path: path.resolve(__dirname, "dist"),
    libraryTarget: "commonjs2",
  },
  node: {
    __dirname: false,
    __filename: false,
  },
  optimization: {
    minimize: true,
  },
};
