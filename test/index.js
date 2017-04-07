;(function () {
  'use strict'

  /* imports */
  var nameFunction = require('../src/lib/name-function')
  var funTest = require('../src/')
  var tests = require('./tests')
  var id = require('fun-id')
  var stringify = require('stringify-anything')

  main()

  function square (x) {
    return x * x
  }

  function main () {
    tests = tests.concat(tests)
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
          subject: square,
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
    console.log(stringify(stuff))

    return stuff.error
  }

  function reportSuccess (stuff) {
    var message = 'ok - # ' +
      nameFunction(stuff.action, [stuff.previous]) +
      ' => ' +
      stringify(stuff.data)

    console.log(message)

    return stuff.data
  }
})()

