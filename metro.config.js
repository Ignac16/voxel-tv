const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Disable file watching to prevent ENOENT errors on Windows
config.resetCache = true;
config.watchFolders = [];

module.exports = config;
