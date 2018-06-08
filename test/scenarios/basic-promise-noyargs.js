'use strict'
global['NO_YARGS'] = true
require('../..')(main)

function main () {
  console.log('started')
  return new Promise((resolve, reject) => {
    console.log('finished')
    resolve()
  })
}
