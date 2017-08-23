'use strict'

import { DIR } from './dirSets.js' // Directory config of project
import path from 'path'
import webpack from 'webpack'
import webpackMerge from 'webpack-merge'
import commonConfig from './webpack-common.config.babel.js'

// production JavaScript config (merge with commonConfig)
let jsConfig = webpackMerge(commonConfig, {
  devtool: 'cheap-module-source-map',
  plugins: [
    new webpack.optimize.UglifyJsPlugin(
      {
        // sourceMap: true
      }
    ),
    // 既に圧縮されているコードのさらに共通化できそうな箇所を圧縮する
    //  for a more aggressive chunk merging strategy.
    new webpack.optimize.AggressiveMergingPlugin()
  ]
})

// export production config
module.exports = jsConfig

// console.log('prod__jsConfig',JSON.stringify(jsConfig,null,2));
