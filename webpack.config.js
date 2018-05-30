var path = require('path')
var UglifyJSPlugin = require('uglifyjs-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var webpack = require('webpack')
var CleanWebpackPlugin = require('clean-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin');

var cssName = 'style.css'
var jsName = 'bundle.js'
var pPath = 'dist/assets'
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

var plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      BROWSER: JSON.stringify(true),
      NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
    }
  })
]

if (process.env.NODE_ENV === 'production') {
  cssName = 'style-[hash].css'
  jsName = 'bundle-[hash]-' + (new Date().getTime()) + '.js'
  plugins.push(
    new CleanWebpackPlugin([pPath + '/'], {
      root: __dirname,
      verbose: true,
      dry: false
    })
  )
}
plugins.push(new CopyWebpackPlugin([
  { from: 'dist/ProximaNova-Regular', to: 'fonts' }
]))
plugins.push(new MiniCssExtractPlugin({
  filename: cssName
}))

plugins.push(new HtmlWebpackPlugin({
  template: './src/index.html',
  filename: 'index.html',
  inject: 'body'
}))

module.exports = {
  mode: 'development',
  entry: [
    './src/index.js'
  ],
  output: {
    path: `${__dirname}/${pPath}/`,
    filename: jsName,
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {includePaths: [path.resolve(__dirname, 'src/css')]}
          }
        ]
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-3']
        }
      }/**/
    ]
  },
  plugins,
  devServer: {
    historyApiFallback: true,
    headers: {'Access-Control-Allow-Origin': '*'}
  },
  optimization: {
    minimizer: [
      new UglifyJSPlugin({
        uglifyOptions: {
          output: {
            comments: false
          },
          compress: {
            unsafe_comps: true,
            properties: true,
            keep_fargs: false,
            pure_getters: true,
            collapse_vars: true,
            unsafe: true,
            warnings: false,
            sequences: true,
            dead_code: true,
            drop_debugger: true,
            comparisons: true,
            conditionals: true,
            evaluate: true,
            booleans: true,
            loops: true,
            unused: true,
            hoist_funs: true,
            if_return: true,
            join_vars: true,
            drop_console: true
          }
        }
      }),
    ]
  }
}