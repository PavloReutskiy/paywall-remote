const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  entry: './src/index.js',
  output: {
    publicPath: 'auto',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.html$/,
        type: 'asset/source',
        include: path.resolve(__dirname, 'src'),
      },
      {
        test: /\.(js|jsx)$/,
        include: path.resolve(__dirname, 'src/paywallD'),
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.(jpg|jpeg|png|gif|svg)$/,
        type: 'asset/resource',
      },
      {
        test: /\.(ttf|woff|woff2)$/,
        type: 'asset/resource',
      },
    ],
  },
  devServer: {
    port: 3001,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      'event-bus': path.resolve(__dirname, 'src/event-bus.js'),
    },
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'paywallRemote',
      filename: 'remoteEntry.js',
      exposes: {
        './PaywallA': './src/paywallA/paywall.js',
        './PaywallB': './src/paywallB/paywall.js',
        './PaywallC': './src/paywallC/paywall.js',
        './PaywallD': './src/paywallD/paywall.js',
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
