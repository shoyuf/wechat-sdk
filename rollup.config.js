import babel from 'rollup-plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import minimist from 'minimist'
import merge from 'lodash.merge'

const args = minimist(process.argv.slice(2))

const entryConfigs = {
  main: {
    input: 'wechat/index.js',
    output: {
      file: 'dist/wechat',
      name: 'Wechat'
    }
  },
  vue: {
    input: 'vue/index.js',
    output: {
      file: 'dist/vue',
      name: 'VueWechat'
    }
  }
}

function createConfig({ format, entry, minify }) {
  let extname = null
  switch (format) {
    case 'umd':
      extname = '.umd.js'
      break
    case 'cjs':
      extname = '.cjs.js'
      break
    case 'esm':
      extname = '.esm.js'
      break
    case 'iife':
      extname = '.global.js'
      break
    default:
      extname = '.js'
  }

  const config = entryConfigs[entry]
  config.output.file += extname
  config.output.format = format
  config.output.sourcemap = true

  const plugins = [
    babel({ runtimeHelpers: true, exclude: 'node_modules/**' }),
    commonjs(),
    resolve()
  ]

  if (minify || format === 'iife' || format === 'umd') {
    plugins.push(terser())
  }

  config.plugins = plugins

  return config
}

export default createConfig(merge({ entry: process.env.BUILD_ENTRY }, args))
