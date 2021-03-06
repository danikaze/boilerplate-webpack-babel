const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const Visualizer = require('webpack-visualizer-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const objectAssign = require('object-assign');
const baseConfig = require('./webpack.base.config.js');
const settings = require('./settings');

const moduleConfig = {
  // Fail out on the first error instead of tolerating it
  bail: true,
  cache: false,
  devtool: 'source-map',
  entry: [
    // Style sheets entry point
    settings.paths.mainStyle,
    // Actual entry point for the source code
    settings.paths.src,
    settings.paths.src + '/index2'
  ],

  // Prod module options
  module: {
    rules: [{
      test: /\.(css|scss|sass)$/,
      exclude: /node_modules/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [
          { loader: 'css-loader', options: { importLoaders: 1, sourceMap: true } },
          { loader: 'sass-loader' },
          { loader: 'postcss-loader',
            options: {
              plugins: () => [ autoprefixer('>1%', 'not ie < 9') ],
            }
          },
        ],
      }),
    }, {
      test: /\.(less)$/,
      exclude: /node_modules/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [
          { loader: 'css-loader', options: { importLoaders: 1, sourceMap: true } },
          { loader: 'less-loader' },
          { loader: 'postcss-loader',
            options: {
              plugins: () => [ autoprefixer('>1%', 'not ie < 9') ],
            }
          },
        ],
      }),
    },
  ]},
};

// We separate plugins from the general options in order to evaluate the latter
const plugins = [
  new webpack.optimize.OccurrenceOrderPlugin,

  new webpack.optimize.UglifyJsPlugin({
    beautify: false,
    comments: false,
    compress: {
      screw_ie8: false,
      warnings: false
    },
    output: {
      screw_ie8: false,
      comments: false
    },
    sourceMap: moduleConfig.devtool.indexOf('sourcemap') >= 0 || moduleConfig.devtool.indexOf('source-map') >= 0
  }),

  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify('production')
    }
  }),

  new webpack.optimize.AggressiveMergingPlugin(), // Merge chunks

  new HtmlWebpackPlugin({
    template: settings.paths.htmlTemplate,
    output: {
      path: settings.paths.buildHtml,
      filename: path.basename(settings.paths.htmlTemplate),
    },
    inject: true,
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeRedundantAttributes: true,
      useShortDoctype: true,
      removeEmptyAttributes: true,
      keepClosingSlash: true,
      minifyJs: true,
      minifyCSS: true,
      minifyURLs: true
    },
  }),

  new webpack.optimize.ModuleConcatenationPlugin(),

  // new webpack.DllReferencePlugin({
  //   context: __dirname,
  //   manifest: require(settings.paths.manifest)
  // }),

  // Requires the 'ExtractTextPlugin.extract' rule
  new ExtractTextPlugin(path.join(settings.paths.buildCss, settings.options.cssName)),

  // Allows to see building stats (radial one)
  new Visualizer({
    filename: '../buildInfo/visualizer.html',
  }),

  // Allows to see building stats (squared one)
  new BundleAnalyzerPlugin({
    analyzerMode: 'static',
    openAnalyzer: false,
    reportFilename: '../buildInfo/analyzer.html',
  }),
]

module.exports = function(env) {
  moduleConfig.plugins = plugins;
  return merge(baseConfig, moduleConfig);
};
