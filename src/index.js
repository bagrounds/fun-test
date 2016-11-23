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
   * @param {Function} [options.transformer] applied to fut prior to test
   */
  function funTest (options) {
    var error = specificationChecker(options)

    assert(!error, error)

    return function test (fut, reporter) {
      try {
        if (options.transformer) {
          fut = options.transformer(fut)
        }

        fut(options.input, function (error, result) {
          var verifierOptions = {
            error: error,
            result: result
          }

          options.verifier(verifierOptions, reporter)
        })
      } catch (error) {
        var verifierOptions = {
          error: error
        }

        options.verifier(verifierOptions, reporter)
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

