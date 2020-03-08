const path = require('path')

const resolve = dr => path.resolve(__dirname, '..', dr)

module.exports = {
  mode: 'production',
  entry: resolve('lib/vue.js'),
  output: {
    path: resolve('dist'),
    filename: '',
    libraryTarget: 'umd2'
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.m?js$/,
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
