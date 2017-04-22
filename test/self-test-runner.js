;(function () {
  'use strict'

  /* imports */
  var id = require('fun-id')
  var runner = require('./fun-test-runner')
  var subject = require('../src')
  var tests = require('./self-tests')

  main()

  function main () {
    runner({
      tests: tests,
      subject: subject
    }).fork(finalError, id)
  }

  function finalError (error) {
    console.error('FINAL_ERROR:' + error.message)
  }
})()

