const path = require('path')
const fs = require('fs')
const merge = require('lodash.merge')

module.exports = function(moduleOptions) {
  // Merge all option sources
  const options = merge(
    { vesion: process.env.JSSDK_VERSION },
    moduleOptions,
    this.options.wechat
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

module.exports.meta = require('../../package.json')
