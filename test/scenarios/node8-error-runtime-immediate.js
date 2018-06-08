'use strict'
require('../..')(main)

async function main () {
  console.log('started')
  main.test.example = 'will explode'
  console.log('finished')
}
