'use strict'
require('../..')(main)

function main () {
  console.log('started')
  throw new Error('boom')
  console.log('finished')
}
