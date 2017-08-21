var dirVars = require('./base/dir-vars.config.js');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

const moduleConfig = require('./inherit/module.config.js');

/*
  由于ExtractTextPlugin不支持热更新，因此选择在开发环境下直接用style-loader加载样式。
  如有问题，可切换回ExtractTextPlugin，即使不能用热更新，也可实现LiveReload
*/

moduleConfig.rules.push({
  test: /\.css$/,
  include: dirVars.srcRootDir,
  use: ExtractTextPlugin.extract({
    fallback: "style-loader",
    use: "css-loader"
  })
});

module.exports = moduleConfig;
