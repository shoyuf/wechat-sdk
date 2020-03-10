const execa = require('execa')
const rimraf = require('rimraf')
const path = require('path')
const chalk = require('chalk')

const entries = ['main', 'vue']
const formats = ['esm', 'cjs', 'umd', 'iife']

function run() {
  rimraf(path.resolve(__dirname, '../dist'), buildAll)
}

async function buildAll() {
  try {
    const tasks = []
    for (let e = 0; e < entries.length; e++) {
      for (let f = 0; f < formats.length; f++) {
        process.env.BUILD_ENTRY = entries[e]
        tasks.push(
          execa('rollup', ['-c', '--format', formats[f]], {
            stdio: 'inherit'
          })
        )
      }
    }
    await Promise.all(tasks)
    console.log(
      '\n✅ ' + chalk.bold(chalk.green('Build completed successfully.'))
    )
  } catch (error) {
    console.log('\n❌ ' + chalk.bold(chalk.red('Build failed.')))
  }

  process.env.BUILD_ENTRY = null
}

run()
