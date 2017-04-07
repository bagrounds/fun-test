;(function () {
  'use strict'

  /* imports */
  var nameFunction = require('../src/lib/name-function')
  var funTest = require('../src/')
  var stringify = require('stringify-anything')

  module.exports = runner

  function runner (options) {
    var testCount = options.tests
      .map(function (array) {
        return array.length
      })
      .reduce(function (a, b) {
        return a + b
      }, 0)

    console.log('1..' + testCount)

    var testOptions = {
      subject: options.subject,
      reporter: reporter
    }

    return options.tests.map(function (tests) {
      return tests
        .map(funTest.of)
        .reduce(funTest.concat, funTest.empty())
    }).reduce(funTest.concat, funTest.empty())(testOptions)
  }

  function reporter (stuff) {
    if (stuff.error) {
      return reportError(stuff)
    }

    return reportSuccess(stuff)
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

