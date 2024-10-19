'use strict'
const onExit = require('signal-exit')
const path = require('path')
const fs = require('fs')
const process = require('process')
const startingWd = process.cwd()
const binName = path.basename(require.main.filename, '.js')
const mainPath = path.resolve(require.main.paths[0], '..')
let argv = process.argv.slice(2)

module.exports = function (entry) {
  let started = false
  let exited = false
  onExit((code, signal) => {
    if (started && !exited) {
      // tested, but exit mechanism can't collect coverage
      /* c8 ignore next */
      if (signal) {
        /* c8 ignore next */
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
        : pkg.bin && Object.keys(pkg.bin).some(b => nameMatch.test(b) || nameMatch.test(pkg.bin[b]))
      if (isInPackage) {
        if (global['NO_NOTIFIER']) throw new Error('NO NOTIFIER')
        const updateNotifier = require('update-notifier');
        updateNotifier({pkg: pkg}).notify()
      }
    } catch (ex) { /* don't care */ }
  })

  let haveYargs
  let yargs
  let haveMinimist
  let minimist
  let minimistConfig = {alias: {}, string: [], boolean: [], default: {}}

  if (process.platform === 'win32') {
    const glob = require('glob').sync
    const cwd = process.cwd()
    const statCache = {}
    const nonull = true
    const expandedArgs = []
    argv.forEach(_ => expandedArgs.push.apply(expandedArgs, glob(_, {cwd, statCache, nonull})))
    argv = expandedArgs
  }
  try {
    if (global['NO_YARGS']) throw new Error('NO YARGS')
    yargs = require('yargs')(argv)
    haveYargs = true
  } catch (_) {
    const noYargs = () => {
      throw new Error('Argument parsing is not available (could not find yargs), to install run: npm i yargs')
    }
    try {
      if (global['NO_MINIMIST']) throw new Error('NO MINIMIST')
      minimist = require('minimist')
      haveMinimist = true
      yargs = {
      /* c8 ignore start */
        alias: function (key, alias) {
            minimistConfig.alias[key] = alias
            return this
        },
        string: function (key) {
            minimistConfig.string.push(key)
            return this
        },
        boolean: function (key) {
            minimistConfig.boolean.push(key)
            return this
        },
        default: function (key, value) {
            minimistConfig.default[key] = value
            return this
        }
      /* c8 ignore stop */
      }
    } catch (_) {
      yargs = new global.Proxy({}, {
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
    let opts
    if (haveYargs) {
      opts = yargs.argv
      argv = opts._
    } else if (haveMinimist) {
      opts = minimist(argv, minimistConfig)
      opts.$0 = path.relative(startingWd,process.argv[1])
      argv = opts._
    } else {
      opts = {_: argv}
      opts.$0 = path.relative(startingWd,process.argv[1])
    }
    started = true
    try {
      const appPromise = entry.apply(null, [opts].concat(argv))
      if (!appPromise || !appPromise.then) {
        return onError(new Error('Application entry point' + (entry.name ? ` (${entry.name})` : '') + ' did not return a promise.'))
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
        console.error((err && err.stack) ? err.stack : err)
      }
      process.exit(1)
    }
  })
  return yargs
}

