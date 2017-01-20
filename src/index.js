/**
 * fun-test is a simple function tester.
 *
 * @module fun-test
 */
;(function () {
  'use strict'

  /* imports */
  var funAssert = require('fun-assert')
  var defaults = require('lodash.defaults')

  var DEFAULT_OPTIONS = {
    input: [],
    error: funAssert.falsey,
    result: funAssert.nothing
  }

  var INPUT_TYPE = '{input: Array, ' +
    'error: Function, ' +
    'result: Function, ' +
    'transformer: Maybe Function}'

  var inputChecker = funAssert.type(INPUT_TYPE)

  /* exports */
  module.exports = funTest

  /**
   * funTest is a simple function tester.
   *
   * @function funTest
   * @alias fun-test
   *
   * @param {Object} options all function parameters
   * @param {Array} [options.input] arguments for subject
   * @param {Function} [options.result] assertion function for result
   * @param {Function} [options.error] assertion function for error
   * @param {Function} [options.transformer] applied to subject prior to test
   * @return {Function} test(subject) runs the test defined here
   */
  function funTest (options) {
    options = inputChecker(defaults(options, DEFAULT_OPTIONS))

    return function test (subject) {
      var testee = transform(subject, options.transformer)

      var error, result

      try {
        result = testee.apply(null, options.input)
      } catch (e) {
        error = e
      }

      var assertionError = catchError(options.error, [error]) ||
        catchError(options.result, [result])

      return {
        options: options,
        error: assertionError
      }
    }
  }

  function catchError (subject, input) {
    try {
      subject.apply(null, input)
    } catch (error) {
      return error
    }
  }

  function transform (subject, transformer) {
    return transformer ? transformer(subject) : subject
  }
})()

