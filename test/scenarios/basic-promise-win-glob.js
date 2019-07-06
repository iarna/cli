'use strict'
const requireInject = require('require-inject')
const mockProcess = Object.assign({}, process, {
  platform: 'win32',
  argv: [process.argv[0], process.argv[1], 'basic-promise-win-gl*.js'],
  cwd: () => __dirname
})
requireInject('../..', {process: mockProcess})(main)

function main (_, args) {
  console.log('started', args)
  return new Promise((resolve, reject) => {
    console.log('finished')
    resolve()
  })
}
