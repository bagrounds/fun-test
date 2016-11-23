/**
 * fun-test is a simple function tester.
 *
 * @module fun-test
 */
;(function () {
  'use strict'

  /* imports */
  var specifier = require('specifier')
  var typeCheck = require('type-check').typeCheck
  var assert = require('power-assert')

  /* exports */
  module.exports = funTest

  var optionsSpec = {
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
   * @param {Function} options.verifier for output of fut given input
   */
  function funTest (options) {
    assert(!specificationChecker(options))

    return function (fut, reporter) {
      try {
        fut(options.input, function (error, result) {
          var verifierOptions = {
            error: error,
            result: result
          }

          options.verifier(verifierOptions, reporter)
        })
      } catch (error) {
        reporter(error)
      }
    }
  }

  function isFunction (candidate) {
    var ok = typeCheck('Function', candidate)

    if (!ok) {
      var message = 'Should be a function.'
      return new Error(message)
    }
  }
})()

