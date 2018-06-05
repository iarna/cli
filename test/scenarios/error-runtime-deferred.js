'use strict'
require('../..')(main)

function defer () {
  return new Promise(r => setImmediate(r))
}

async function main () {
  console.log('started')
  await defer() 
  main.test.example = 'will explode'
  console.log('finished')
}
