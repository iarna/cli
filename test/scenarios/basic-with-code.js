'use strict'
require('../..')(main)

function main () {
  console.log('started')
  return new Promise((resolve, reject) => {
    console.log('finished')
    reject(23)
  })
}
