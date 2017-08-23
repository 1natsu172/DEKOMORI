'use strict'

import { DIR } from './dirSets.js' // Directory config of project
import path from 'path'
import webpack from 'webpack'
import ProgressPlugin from 'webpack/lib/ProgressPlugin'
const CURRENT_WORKING_DIR = process.cwd() // Get the `current working directory` of node

const commonConfig = {
  // entry points
  entry: {
    app: DIR.src.assetsScript + '/app.js',
    index: DIR.src.assetsScript + '/index.js'
  },
  // output config
  output: {
    filename: '[name].bundle.js'
  },
  // Resolve every module directory path, for useful and easily.
  resolve: {
    modules: [
      path.resolve(CURRENT_WORKING_DIR, DIR.src.assetsScript + '/modules'), // Resolve own JSmodules directory
      'node_modules' // Resolve `node_modules` directory
    ],
    // Create aliases to certain modules more easily.
    alias: {
      modernizr$: path.resolve(__dirname, '.modernizrrc')
    }
  },
  // module
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          babelrc: false,
          presets: [
            [
              'env',
              {
                modules: false // Use Tree Shaking
              }
            ],
            'stage-3'
          ],
          plugins: ['transform-runtime'] // transform-runtime polyfill
        }
      },
      {
        test: /\.modernizrrc(\.json)?$/,
        loader: 'modernizr-loader!json-loader'
      }
    ]
  },
  // plugins
  plugins: [
    // CommonsChunkPlugin
    new webpack.optimize.CommonsChunkPlugin({
      name: 'commonsChunk'
    }),
    // Automatically load modules instead of having to `import` or `require` them everywhere.
    new webpack.ProvidePlugin({
      // use jQuery everywhere
      jQuery: 'jquery',
      $: 'jquery',
      jquery: 'jquery',
      'window.jQuery': 'jquery'
    }),
    // Define environment variables to be handled
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    // Output progress to the console
    new ProgressPlugin({ profile: true }, function(percentage, msg) {
      console.log(percentage * 100 + '%', msg)
    })
  ]
}

// export config object
module.exports = commonConfig
