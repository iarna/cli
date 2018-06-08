'use strict'
global['NO_YARGS'] = true
require('../../')(main)
  .boolean('test')

function main () {
  console.log('started')
  return new Promise((resolve, reject) => {
    console.log('finished')
    resolve()
  })
}
