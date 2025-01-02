const webpack = require('@nativescript/webpack');
const { resolve } = require('path');

module.exports = (env) => {
  webpack.init(env);

  webpack.chainWebpack((config) => {
    // Add polyfills for Supabase
    config.resolve.fallback = {
      ...config.resolve.fallback,
      'crypto': require.resolve('crypto-browserify'),
      'stream': require.resolve('stream-browserify'),
      'url': require.resolve('url/'),
      'buffer': require.resolve('buffer/')
    };

    config.plugin('provide').use(webpack.ProvidePlugin, [{
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
    }]);
  });

  return webpack.resolveConfig();
};