'use strict'
require('../..')(main)

async function main () {
  console.log('started')
  throw new Error('boom')
  console.log('finished')
}
