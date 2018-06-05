'use strict'
const onExit = require('signal-exit')
const path = require('path')
const fs = require('fs')
const binName = path.basename(require.main.filename, '.js')
const mainPath = path.resolve(require.main.paths[0], '..')

module.exports = function (entry) {
  let started = false
  let exited = false
  onExit((code, signal) => {
    if (started && !exited) {
      if (signal) {
        console.error('Abnormal exit:', signal)
      } else {
        console.error('Abnormal exit: Promises not resolved')
      }
      process.exit(code || 1)
    }
  })
  fs.readFile(mainPath + '/package.json', (err, data) => {
    try {
      const pkg = JSON.parse(data)
      const nameMatch = new RegExp(binName, 'i')
      let isInPackage = typeof pkg.bin === 'string'
        ? nameMatch.test(pkg.bin)
        : Object.keys(pkg.bin).some(b => nameMatch.test(b) || nameMatch.test(pkg.bin[b]))
      if (isInPackage) {
        const updateNotifier = require('update-notifier');
        updateNotifier({pkg: pkg}).notify()
      }
    } catch (ex) { /* don't care */ }
  })

  let yargs
  let opts
  let argv
  try {
    yargs = require('yargs')
    opts = yargs.argv
    argv = opts._
  } catch (_) {
    argv = process.argv.slice(2)
    opts = {_: argv}
    if (global.Proxy) {
      const noYargs = () => {
        throw new Error('Argument parsing is not available (could not find yargs), to install run: npm i yargs')
      }
      yargs = new Proxy({}, {
        getPrototypeOf: noYargs,
        setPrototypeOf: noYargs,
        isExtensible: noYargs,
        preventExtensions: noYargs,
        getOwnPropertyDescriptor: noYargs,
        defineProperty: noYargs,
        has: noYargs,
        get: noYargs,
        set: noYargs,
        deleteProperty: noYargs,
        ownKeys: noYargs,
        apply: noYargs,
        construct: noYargs
      })

    }
  }
  setImmediate(() => {
    started = true
    try {
      const appPromise = entry.apply(null, [opts].concat(argv))
      if (!appPromise || !appPromise.then) {
        return onError(new Error('Error: Application entry point' + (entry.name ? ` (${entry.name})` : '') + ' did not return a promise.'))
      }
      appPromise.then(() => exited = true, onError)
    } catch (ex) {
      onError (ex)
    }
    function onError (err) {
      exited = true
      if (typeof err === 'number') {
        process.exit(err)
      } else if (err) {
        console.error(err && err.stack ? err.stack : err)
      }
      process.exit(1)
    }
  })
  return yargs
}

