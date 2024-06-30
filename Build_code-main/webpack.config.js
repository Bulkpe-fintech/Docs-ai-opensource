const path = require("path");
// const Dotenv = require("dotenv-webpack");
const webpack = require("webpack");
module.exports = {
  mode: "production",
  entry: path.join(__dirname, "src/index.js"),
  // externals: [nodeExternals()],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.min.js",
    assetModuleFilename: "[name][ext]",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.(png|jpg|gif|jpeg)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "./resources/imgs",
              name: "[name].[ext]",
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    // new Dotenv({
    //   path: path.resolve(__dirname, ".env"),
    // }),
    new webpack.IgnorePlugin({
      resourceRegExp: /^(kerberos|@mongodb-js\/zstd|@aws-sdk\/credential-providers|snappy|socks|mongodb-client-encryption|pickleparser)$/,
    }),
    new webpack.ContextReplacementPlugin(/express\/lib/, path.resolve(__dirname, "node_modules")),
  ],
  resolve: {
    fallback: {},
    extensions: [".js", ".jsx"],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    compress: true,
    port: 3000,
  },
};
