/**
 *
 * @module fun-test-runner
 */
;(function () {
  'use strict'

  /* imports */
  var Task = require('data.task')
  var nameFunction = require('./lib/name-function')
  var funTest = require('../../src/')
  var stringify = require('stringify-anything')
  var tap = require('test-anything-protocol')

  /* exports */
  module.exports = runner

  var i = 1

  function runner (options) {
    console.log(tap.plan(countTests(options.tests)))

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

  function countTests (tests) {
    return tests.map(function (array) {
      return array.length
    }).reduce(function (a, b) {
      return a + b
    }, 0)
  }

  function reporter (stuff) {
    return new Task(function (onError, onSuccess) {
      if (stuff.comment) {
        console.log(tap.diagnostic(stuff.comment))
      }

      if (stuff.error) {
        reportError(stuff)
      } else {
        reportSuccess(stuff)
      }
      onSuccess(stuff)
    })
  }

  function reportError (stuff) {
    console.log(tap.test({
      ok: false,
      description: stuff.error.message,
      number: i++
    }))
  }

  function reportSuccess (stuff) {
    var message = nameFunction(stuff.action, [stuff.data]) +
      ' => ' +
      stringify(stuff.result)

    console.log(tap.test({
      ok: true,
      description: message,
      number: i++
    }))
  }
})()

