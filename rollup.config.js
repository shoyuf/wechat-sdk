import babel from 'rollup-plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import minimist from 'minimist'

const args = minimist(process.argv.slice(2))

const entryConfigs = {
  main: {
    input: 'lib/wechat/index.js',
    output: {
      file: 'dist/wechat',
      name: 'Wechat'
    }
  },
  vue: {
    input: 'lib/vue.js',
    output: {
      file: 'dist/vue',
      name: 'VueWechat'
    }
  },
  nuxt: {
    input: 'lib/wechat/index.js',
    output: {
      file: 'dist/nuxt/wechat-core',
      format: 'esm'
    }
  }
}

const getConfig = ({ format, entry }) => {
  let extname = null
  switch (format) {
    // case 'umd':
    //   extname = '.js'
    //   break
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

  return config
}

const getPlugins = ({ format, minify }) => {
  const plugins = [
    babel({ runtimeHelpers: true, exclude: 'node_modules/**' }),
    commonjs()
  ]

  if (minify || format === 'iife' || format === 'umd') {
    plugins.push(terser())
  }

  return plugins
}

export default {
  ...getConfig(args),
  plugins: getPlugins(args)
}
