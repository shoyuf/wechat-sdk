const execa = require('execa')
const rimraf = require('rimraf')
const path = require('path')

const entries = ['main', 'vue']
const formats = ['esm', 'cjs', 'umd', 'iife']

function run() {
  rimraf(path.resolve(__dirname, '../dist'), buildAll)
}

async function buildAll() {
  for (let e = 0; e < entries.length; e++) {
    for (let f = 0; f < formats.length; f++) {
      process.env.BUILD_ENTRY = entries[e]

      await execa('rollup', ['-c', '--format', formats[f]], {
        stdio: 'inherit'
      })
    }
  }

  process.env.BUILD_ENTRY = null
}

run()
