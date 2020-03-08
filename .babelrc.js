module.exports = {
  presets: [['@babel/env']],
  plugins: [
    ['@babel/transform-runtime', { regenerator: true }],
    ['@babel/plugin-proposal-class-properties', { loose: false }]
  ]
}
