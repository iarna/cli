'use strict'
require('../..')(main)

async function main () {
  console.log('started')
  throw 'boom'
  console.log('finished')
}
