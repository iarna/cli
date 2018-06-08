'use strict'
require('../..')(main)

function main () {
  console.log('started')
  return new Promise((resolve, reject) => {
    process.exit()
    console.log('finished')
    resolve()
  })
}
