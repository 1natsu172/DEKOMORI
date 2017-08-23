'use strict'

import { DIR } from './dirSets.js' // Directory config of project
import path from 'path'
import webpack from 'webpack'
import webpackMerge from 'webpack-merge'
import minimist from 'minimist'
import commonConfig from './webpack-common.config.babel.js'

const argv = minimist(process.argv.slice(2)) // parse arguments from CLI

// develop JavaScript config (merge with commonConfig)
let jsConfig = webpackMerge(commonConfig, {
  devtool: 'cheap-module-eval-source-map'
})

// When in the lint mode, add the config object for lint
if (argv.SETMODE === 'lint') {
  jsConfig = webpackMerge(jsConfig, {
    module: {
      rules: [
        {
          enforce: 'pre',
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'eslint-loader'
        }
      ]
    }
  })
}

// export develop config
module.exports = jsConfig

// console.log('dev__jsConfig',JSON.stringify(jsConfig,null,2));
