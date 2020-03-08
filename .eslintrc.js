const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    'no-debugger': isProduction ? 2 : 1,
    'no-alert': isProduction ? 2 : 1,
    'no-console': isProduction ? [2, { allow: ['info', 'warn', 'error'] }] : 0
  }
}
