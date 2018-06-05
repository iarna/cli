'use strict'
require('../..')(main)

async function main () {
  console.log('started')
  console.log('finished')
}

main.test.example = 'will explode'
