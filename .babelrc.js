module.exports = {
  presets: [['@babel/env']],
  plugins: [
    ['@babel/plugin-transform-runtime', { helpers: false, regenerator: true }],
    ['@babel/plugin-proposal-class-properties', { loose: false }]
  ],
  sourceMaps: true,
  inputSourceMap: true
}
