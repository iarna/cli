'use strict'
global['NO_YARGS'] = true
require('../..')(main)
  .boolean('i')
  .boolean('test')

function main (opt, ...args) {
  console.log('started')
  return new Promise((resolve, reject) => {
    console.log('finished', JSON.stringify([opt, args]))
    resolve()
  })
}
