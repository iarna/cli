'use strict'
const fs = require('fs')
const path = require('path')
const test = require('tap').test
const glob = require('glob').sync
const qx = require('@perl/qx')
let tests = glob(`${__dirname}/scenarios/*js`)

const isNode8Up = process.versions.modules >= 57
const isNode6Up = process.versions.modules >= 48
if (!isNode8Up) tests = tests.filter(_ => !/[/]node8-/.test(_))
if (!isNode6Up) tests = tests.filter(_ => !/[/]node6-/.test(_))

test('scenarios', t => {
  t.plan(tests.length)
  return Promise.all(tests.map(scenarioFile => {
    const scenario = path.basename(scenarioFile, '.js')
    const expectedFile = `${path.dirname(scenarioFile)}/${scenario}.out`
    let lines = []
    try {
      lines = fs.readFileSync(expectedFile, 'utf8').trim().split('\n')
    } catch (_) {}
    const exitStatus = lines.pop()
    const expected = { exitStatus: exitStatus, lines: lines }
    return qx`node ${scenarioFile} 2>&1; echo $?`.then(rawResult => {
      t.like(clean(rawResult), expected, scenario)
    })
  }))
})

function clean (out) {
  const lines = out.trim()
    .replace(/[(][/].*[/](app.js|scenarios[/].*.js):\d+:\d+/g, '($1:')
    .replace(/^[/].*[/](app.js|scenarios[/].*.js):\d+/g, '$1:')
    .replace(/^(?:.|\n)*(Error: Argument parsing)/, '$1')
    .split('\n')
  const exitStatus = lines.pop()
  return { exitStatus: exitStatus, lines: lines }
}
