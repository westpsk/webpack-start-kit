var ExtractTextPlugin = require('extract-text-webpack-plugin');
var dirVars = require('./base/dir-vars.config.js');

const moduleConfig = require('./inherit/module.config.js');

moduleConfig.rules.push({
  test: /\.css$/,
  include: dirVars.srcRootDir,
  use: ExtractTextPlugin.extract([
    {
      loader: 'css-loader',
      options: {
        minimize: true,
        '-autoprefixer': true,
      },
    },
    {
      loader: 'postcss-loader',
    }
  ]),
});

module.exports = moduleConfig;