const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;

const pagesDir = path.resolve(__dirname, './src/views');

//查找入口文件
var globInstance = new glob.Glob('!(_)*/!(_)*', {
  cwd: pagesDir, // 在pages目录里找
  sync: true, // 这里不能异步，只能同步
});
var configEntry = {};
globInstance.found.forEach((page) => {
  configEntry[page] = path.resolve(pagesDir, page + '/page.js');
});
console.log("=====configEntry=====");
console.log(configEntry);

module.exports = {
  entry: configEntry,
  output: {
    path: path.join(__dirname, '/../build'),
    publicPath: '/',
    filename: 'js/[name].js',
    chunkFilename: '[id].[chunkhash].bundle.js',
  },
  resolve: {
    extensions: ['.js', '.json'],
    modules: [path.resolve(__dirname, "src"), path.resolve(__dirname, "node_modules")]
  },
  module: {
    rules: [
      {
        test: /\.css/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader!css-loader',
          use: [
            {
              loader: 'css-loader?minimize'
            }
          ]
        })
      },
      {
        test: /\.js$/,
        include: [path.resolve(__dirname, "src")],
        loader: 'babel-loader',
        options: {
          presets: [['es2015', { loose: true }]],
          cacheDirectory: true,
          plugins: ['transform-runtime'],
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 8192
        },
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
        loader: 'file-loader'
      }
    ]
  },
  plugins: [
    new CommonsChunkPlugin({
      name: 'js',
      filename: "vendor.js",
      minChunks: 4,
    }),
    new ExtractTextPlugin({
      filename: 'styles.css',
      allChunks:true
    })
  ]
}

if (process.env.NODE_ENV === 'production') {
  module.exports.plugins = module.exports.plugins || []

  // hjl: 该插件必须放在压缩之前，否则在js中变量会被替换，比如process.env.NODE_ENV变成t.env.NODE_ENV
  module.exports.plugins = module.exports.plugins.concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
        DEBUG_ENV: JSON.stringify(process.env.DEBUG_ENV)
      }
    })
  ])
  let uglifyOpt = {}
  if(process.env.BABEL_ENV === 'ie8'){
    uglifyOpt = {
      supper_ie8: true,
      screw_ie8: false,
      compress: {
          properties: false,
          warnings: false
      },
      output: {
          beautify: true,
          quote_keys: true
      },
      mangle: {
          screw_ie8: false
      },
      sourceMap: false
    }

    const es3ifyPlugin = require('es3ify-webpack-plugin');
    module.exports.plugins = module.exports.plugins.concat([
      new es3ifyPlugin()
    ])
  }

  module.exports.plugins = module.exports.plugins.concat([
    new ParallelUglifyPlugin({
      uglifyJS: uglifyOpt
    }),
    new HtmlWebpackPlugin({
      filename: path.resolve(__dirname, 'www','index.html'),
      template: path.join(__dirname, 'tpl_demo.html'),
      inject: true
    })
  ])

}else{
  console.log("process.env");
  console.log(process.env);
}
