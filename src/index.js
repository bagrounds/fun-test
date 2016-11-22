/**
 * fun-test is a simple function tester.
 *
 * @module fun-test
 */
;(function () {
  'use strict'

  /* imports */
  var specifier = require('specifier')
  var typeCheck = require('type-check')

  /* exports */
  module.exports = funTest

  var optionsSpec = {
    fut: [
      isFunction
    ],
    input: [
    ],
    verifier: [
      isFunction
    ]
  }

  var specificationChecker = specifier(optionsSpec)

  /**
   * funTest is a simple function tester.
   *
   * @function funTest
   * @alias fun-test
   *
   * @param {Object} options all function parameters
   * @param {*} options.input to test
   * @param {Function} options.fut function under test
   * @param {Function} options.verifier for output of fut given input
   * @param {Function} reporter handles verifier results
   */
  function funTest (options, reporter) {
    var error = specificationChecker(options)

    if (error) {
      reporter(error)
      return
    }

    options.fut(options.input, function (error, result) {
      var verifierOptions = {
        error: error,
        result: result
      }

      options.verifier(verifierOptions, reporter)
    })
  }

  function isFunction (candidate) {
    var ok = typeCheck('Function', candidate)

    if (!ok) {
      var message = 'Should be a function.'
      return new Error(message)
    }
  }
})()

