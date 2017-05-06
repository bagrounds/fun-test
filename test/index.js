;(function () {
  'use strict'

  /* imports */
  var tests = require('./tests')
  var runner = require('./runner')

  var subject = {
    add: function (a, b) {
      return a + b
    }
  }

  main()

  function main () {
    runner(tests, subject).fork(testError, id)
  }

  function testError (error) {
    console.error('TEST_ERROR:' + error.message)
  }

  function id (x) {
    return x
  }
})()

