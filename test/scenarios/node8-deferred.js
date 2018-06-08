'use strict'
require('../..')(main)

let foo

async function main () {
  console.log('started')
  console.log(foo)
  console.log('finished')
}

foo = 23