const { resolve } = require('path')

module.exports = {
  mode: 'spa',
  rootDir: resolve(__dirname, '../'),
  buildDir: resolve(__dirname, '.nuxt'),
  srcDir: __dirname,
  render: {
    resourceHints: false
  },
  modules: [{ handler: require('../../nuxt') }],
  wechat: {
    version: '1.4.0',
    source: {
      jssdk: [
        { src: '//res2.wx.qq.com/open/js/jweixin-1.4.0.js', version: '1.4.0' }
      ]
    }
  }
}
