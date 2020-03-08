const execa = require('execa')

const entries = ['main', 'vue']
const formats = ['esm', 'cjs', 'umd', 'iife']

async function buildAll() {
  for (let e = 0; e < entries.length; e++) {
    for (let f = 0; f < formats.length; f++) {
      await execa(
        'rollup',
        ['-c', '--entry', entries[e], '--format', formats[f]],
        { stdio: 'inherit' }
      )
    }
  }
}

buildAll()
