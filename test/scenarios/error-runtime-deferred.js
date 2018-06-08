'use strict'
require('../..')(main)

function defer () {
  return new Promise(r => setImmediate(r))
}

function main () {
  console.log('started')
  return defer().then(() => {
    main.test.example = 'will explode'
    console.log('finished')
  })
}
