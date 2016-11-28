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
   * @param {Function} options.verifier for output of subject given input
   * @param {Function} [options.transformer] applied to subject prior to test
   */
  function funTest (options) {
    var error = specificationChecker(options)

    if (error) {
      throw error
    }

    return function test (subject, reporter) {
      try {
        if (options.transformer) {
          subject = options.transformer(subject)
        }

        subject(options.input, function (error, output) {
          var verifierOptions = {
            error: error,
            output: output
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

