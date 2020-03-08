const path = require('path')

const resolve = dr => path.resolve(__dirname, dr)

const isVueLib = 'vue' === process.env.BUILD_MODE

module.exports = {
  mode: 'production',
  entry: resolve(isVueLib ? 'lib/vue.js' : 'lib/wechat/index.js'),
  output: {
    path: resolve('dist'),
    filename: isVueLib ? 'vue.js' : 'wechat.js',
    libraryTarget: 'umd2',
    library: isVueLib ? 'VueWechat' : 'WechatSDKManager'
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              ['@babel/plugin-proposal-class-properties', { loose: false }]
            ]
          }
        }
      }
    ]
  }
}
