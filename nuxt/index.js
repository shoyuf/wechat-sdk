/**
 * Copyright (c) 2020 rexerwang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const path = require('path')
const fs = require('fs')
const deepmerge = require('deepmerge')

module.exports = function(moduleOptions) {
  // Merge all option sources
  const options = deepmerge(
    {
      version: process.env.JSSDK_VERSION,
      ...(this.options.wechat || {})
    },
    moduleOptions,
    { arrayMerge: (target, source) => source }
  )

  // Copy wechat source
  const sourceRoot = path.resolve(__dirname, '../wechat')
  for (const file of fs.readdirSync(sourceRoot)) {
    this.addTemplate({
      src: path.resolve(sourceRoot, file),
      fileName: path.join('core/wechat', file)
    })
  }

  // Register plugin
  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
    fileName: 'wechat.js',
    options
  })
}

module.exports.meta = require('../package.json')
