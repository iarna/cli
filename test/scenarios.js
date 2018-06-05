'use strict'
const fs = require('fs')
const path = require('path')
const test = require('tap').test
const glob = require('glob').sync
const tests = glob(`${__dirname}/scenarios/*js`)
const qx = require('@perl/qx').sync

test('scenarios', t => {
  t.plan(tests.length)
  tests.forEach(scenarioFile => {
    const scenario = path.basename(scenarioFile, '.js')
    const expectedFile = `${path.dirname(scenarioFile)}/${scenario}.out`
    const expected = fs.readFileSync(expectedFile, 'utf8').trim()
    t.like(clean(qx`node ${scenarioFile} 2>&1`), expected, scenario)
  })
})

function clean (out) {
  return out.trim()
    .replace(/[(][/].*[/](app.js|scenarios[/].*.js):\d+:\d+/g, '($1:')
    .replace(/^[/].*[/](app.js|scenarios[/].*.js):\d+/g, '$1:')
}
