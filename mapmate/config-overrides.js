const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const { override, addWebpackPlugin } = require("customize-cra");

const fs = require("fs");
const dotenv = require("dotenv").config();

module.exports = override((config) => {
  config.plugins = config.plugins.map((plugin) => {
    if (plugin instanceof HtmlWebpackPlugin) {
      return new HtmlWebpackPlugin({
        ...plugin.options,
        templateParameters: {
          ...plugin.options.templateParameters,
          REACT_APP_KAKAO_API: dotenv.parsed.REACT_APP_KAKAO_API,
        },
      });
    }
    return plugin;
  });
  return config;
}, addWebpackPlugin(new Dotenv()));
