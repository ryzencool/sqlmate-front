const {
  launchEditorMiddleware,
} = require("react-dev-inspector/plugins/webpack");
module.exports = {
  devServer: (devServerConfig, { env, paths, proxy, allowedHost }) => {
    devServerConfig.setupMiddlewares = (middlewares, devServer) => {
      middlewares.unshift(launchEditorMiddleware);
      return middlewares;
    };
    return devServerConfig;
  },
  webpack: {
    configure: {
      // See https://github.com/webpack/webpack/issues/6725
      module: {
        rules: [
          {
            test: /\.wasm$/,
            type: "javascript/auto",
          },
        ],
      },
      resolve: {
        extensions: [".js", ".jsx", ".json", ".ts", ".tsx"], // other stuff
        fallback: {
          fs: false,
          path: require.resolve("path-browserify"),
          crypto: false,
        },
      },
    },
  },
};
