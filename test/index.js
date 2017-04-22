;(function () {
  'use strict'

  /* imports */
  var tests = require('./tests')
  var id = require('fun-id')
  var runner = require('./fun-test-runner')

  main()

  function square (x) {
    return x * x
  }

  function main () {
    runner({
      tests: tests,
      subject: square
    }).fork(finalError, id)
  }

  function finalError (error) {
    console.error('FINAL_ERROR:' + error.message)
  }
})()

