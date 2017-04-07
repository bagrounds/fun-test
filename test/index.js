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
    var testCount = tests
      .map(function (array) {
        return array.length
      })
      .reduce(function (a, b) {
        return a + b
      }, 0)

    console.log('1..' + testCount)

    tests.map(function (tests) {
      return tests
        .map(funTest.of)
        .reduce(funTest.concat, funTest.empty())({
          subject: subject,
          reporter: reporter
        }).fork(finalError, id)
    })
  }

  function reporter (stuff) {
    if (stuff.error) {
      return reportError(stuff)
    }

    return reportSuccess(stuff)
  }

  function finalError (error) {
    console.error('FINAL_ERROR:' + error.message)
  }

  function reportError (stuff) {
    console.log('not ok - an error:', stuff.error.message)

    return stuff.error
  }

  function reportSuccess (stuff) {
    console.log('ok - data:', stuff.data)

    return stuff.data
  }
})()

