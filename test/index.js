;(function () {
  'use strict'

  /* imports */
  var funTest = require('../src/')
  var tests = require('./tests')
  var id = require('fun-id')

  main()

  function subject (x) {
    return x * x
  }

  function main () {
    tests.map(function (tests) {
      console.log('1..' + tests.length)

      tests
        .map(funTest.of)
        .reduce(funTest.concat, funTest.empty())({
          subject: subject,
          reporter: {
            error: errorReporter,
            success: successReporter
          }
        }).fork(finalError, id)
    })
  }

  function finalError (error) {
    console.error('FINAL_ERROR:' + error.message)
  }

  function errorReporter (error) {
    console.log('not ok - an error:', error.message)

    return error
  }

  function successReporter (data) {
    console.log('ok - data:', data)

    return data
  }
})()

