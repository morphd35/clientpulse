import { NativeScriptConfig } from '@nativescript/core';

export default {
  id: 'org.nativescript.southernglazersales',
  appPath: 'app',
  appResourcesPath: 'App_Resources',
  android: {
    v8Flags: '--expose_gc',
    markingMode: 'none',
    maxLogcatObjectSize: 2048
  },
  ios: {
    discardUncaughtJsExceptions: true
  },
  webpackConfigPath: 'webpack.config.js'
} as NativeScriptConfig;