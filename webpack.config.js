const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  entry: './src/dev.js',
  output: {
    publicPath: 'auto',
    clean: true,
  },
  devServer: {
    port: 3001,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  resolve: {
    alias: {
      'event-bus': path.resolve(__dirname, 'src/event-bus.js'),
    },
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'paywallRemote',
      filename: 'remoteEntry.js',
      exposes: {
        './PaywallA': './src/paywallA.js',
        './PaywallB': './src/paywallB.js',
        './PaywallC': './src/paywallC.js',
      },
      shared: {
        'event-bus': { singleton: true, requiredVersion: false },
      },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
};
