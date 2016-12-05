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
   */
  function funTest (options) {
    specificationChecker(options)

    return function test (subject, reporter) {
      try {
        if (options.transformer) {
          subject = options.transformer(subject)
        }

        subject(options.input, function (error, result) {
          try {
            options.verifier(error, result)
            reporter()
          } catch (e) {
            reporter(e)
          }
        })
      } catch (error) {
        reporter(error)
      }
    }
  }
})()

