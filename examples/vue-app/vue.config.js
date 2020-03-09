module.exports = {
  chainWebpack: config => {
    config
      .plugin('copy-dist')
      .use(require('copy-webpack-plugin'), [
        [{ from: '../../dist', to: 'static' }]
      ])
  }
}
