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

  /* exports */
  module.exports = funTest

  var optionsSpec = {
    input: [
    ],
    verifier: [
      funAssert.type('Function')
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
   * @return {Function} test(subject, reporter) runs the test defined here
   */
  function funTest (options) {
    specificationChecker(options)

    return function test (subject, reporter) {
      try {
        if (options.transformer) {
          subject = options.transformer(subject)
        }

        subject(options.input, options.verifier)
        reporter()
      } catch (error) {
        try {
          options.verifier(error)
          reporter()
        } catch (e) {
          reporter(e)
        }
      }
    }
  }
})()

