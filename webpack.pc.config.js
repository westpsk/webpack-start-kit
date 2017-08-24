const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;

const ENV = 'pc';

const pagesDir = path.resolve(__dirname, ENV, './pages');
const buildDir = path.resolve(__dirname, './www/resource');

//查找入口文件
var globInstance = new glob.Glob('!(_)*/!(_)*', {
  cwd: pagesDir, // 在pages目录里找
  sync: true, // 这里不能异步，只能同步
});
var configEntry = {};
globInstance.found.forEach((page) => {
  configEntry[page] = path.resolve(pagesDir, page + '/page.js');
});

module.exports = {
  entry: configEntry,
  output: {
    path: buildDir,
    publicPath: '/',
    filename: `js/${ENV}/[name].js`,
    chunkFilename: '[id].[chunkhash].bundle.js',
  },
  resolve: {
    extensions: ['.js', '.json'],
    modules: [path.resolve(__dirname, "src"), path.resolve(__dirname, "node_modules")]
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        include: pagesDir,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader!sass-loader"
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
      filename: `js/${ENV}/bundle.js`,
      minChunks: 4,
    }),
    new ExtractTextPlugin(`css/${ENV}/[name].css`)
  ]
}

if (process.env.NODE_ENV === 'production') {
  module.exports.plugins = module.exports.plugins || []

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
    })
  ])

}else{
  console.log("process.env");
  console.log(process.env.NODE_ENV);
}
