'use strict'
global['NO_YARGS'] = true
global['NO_MINIMIST'] = true
require('../..')(main)

function main (opt, ...args) {
  console.log('started')
  return new Promise((resolve, reject) => {
    console.log('finished', JSON.stringify([opt, args]))
    resolve()
  })
}
