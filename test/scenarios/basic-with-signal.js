'use strict'
require('../..')(main)

function main () {
  console.log('started')
  return new Promise((resolve, reject) => {
    process.kill(process.pid, 'SIGTERM')
    setImmediate(() => {
      console.log('finished')
      resolve()
    })
  })
}
