// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

module.exports = {
  ...defaultConfig,
  resolver: {
    ...defaultConfig.resolver,
    extraNodeModules: {
      "nanoid/non-secure": require.resolve("nanoid/non-secure/index.cjs"),
    },
  },
};
