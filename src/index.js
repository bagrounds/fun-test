/**
 * fun-test is a simple function tester.
 *
 * @module fun-test
 */
;(function () {
  'use strict'

  /* imports */
  var specifier = require('specifier')
  var funAssert = require('fun-assert')

  var isFunction = funAssert.type('Function')

  /* exports */
  module.exports = funTest

  var optionsSpec = {
    input: [
    ],
    verifier: [
      isFunction
    ]
  }

  var validateOptions = specifier(optionsSpec)

  var testSpec = {
    subject: [
      isFunction
    ],
    reporter: [
      isFunction
    ]
  }

  var validateTestInput = specifier(testSpec)

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
   * @return {Function} test(subject, reporter) runs the test defined here
   */
  function funTest (options) {
    validateOptions(options)

    var input = options.input
    var verifier = options.verifier
    var transformer = options.transformer

    return function test (subject, reporter) {
      if (transformer) {
        subject = transformer(subject)
      }

      validateTestInput({
        subject: subject,
        reporter: reporter
      })

      try {
        subject(input, verifier)
        reporter()
      } catch (error) {
        try {
          verifier(error)
          reporter()
        } catch (e) {
          reporter(e)
        }
      }
    }
  }
})()

