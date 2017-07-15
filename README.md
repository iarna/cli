# @iarna/cli

Some simple CLI scaffolding for promise returning applications.

## EXAMPLE

```
require('@iarna/cli')(main)
  .boolean('silent')
  .boolean('exit')
  .version()
  .help()

function main (opts, arg1, arg2, arg3) {
  if (!opts.silent) console.error('Starting up!')
  console.log('Got:', arg1, arg2, arg3)
  if (opts.error) throw new Error('throw')
  return new Promise(resolve => setTimeout(resolve, 10000))
}
```

## WHAT YOU GET

* `yargs` - The wrapper around the main function returns a yargs object, so
  you can configure it as usual.  The `argv` object is passed in as the
  first argument of your entry point function.  The rest of your positional
  arguments are passed in as the remaining function arguments.
* _exit without resolving warnings_ - If your program finishes without
  resolving its promises (like if it crashes hard or you process.exit, or you just don't resolve the promise ) then
  we warn about that.
* `update-notifier` - A default update notifier is setup for your app so
  users will learn about new versions when you publish them. Your app needs to
  have a name, version and bin entry in its `package.json`. (The bin entry
  needs to have the script using `@iarna/cli` in it for the update notifier
  to trigger.)
* If your entry point function rejects then that's reported with a stack
  trace (if the rejected value has `.stack`) else with the rejected value
  and your process will exit with an error code.

## WHAT ITS NOT

A full framework for writing cli apps.  You'll likely outgrow the error
handling pretty fast if this is anything beyond a little one off.  This
mostly exists to scratch my own itch.  I kept on writing this code and I
wanted to stop.  =D

## USAGE

### require('@iarna/cli')(entryPointFunction) → yargs

The module itself returns a function that you need to call with the name of
your main function.  This is the top level function of your program that
should return a promise, that when resolved indicates that your program is
complete.

Your entry point function should look like this:

`main(opts, arg1, arg2, …, argn) → Promise`

The first `opts` argument is `yargs.argv` and the additional arguments are
from `argv._`, so `arg1 === argv._[0]`, `arg2 === argv._[1]` and so on.
