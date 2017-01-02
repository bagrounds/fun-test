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
  var defaults = require('lodash.defaults')
  var stringify = require('stringify-anything')

  var defaultErrorAssertion = funAssert.falsey

  var defaultOptions = {
    timeout: 1000,
    error: defaultErrorAssertion,
    result: identity,
    transformer: identity
  }

  var isFunction = funAssert.type('Function')
  var isNumber = funAssert.type('Number')

  /* exports */
  module.exports = funTest

  var optionsSpec = {
    error: [
      isFunction
    ],
    result: [
      isFunction
    ],
    timeout: [
      isNumber
    ]
  }

  var validateOptions = specifier(optionsSpec)

  /**
   * funTest is a simple function tester.
   *
   * @function funTest
   * @alias fun-test
   *
   * @param {Object} options all function parameters
   * @param {*} [options.input] to test
   * @param {Function} [options.result] assertion function for result
   * @param {Function} [options.error] assertion function for error
   * @param {Function} [options.transformer] applied to subject prior to test
   * @param {Number} [options.timeout] ms to wait for callback to be called
   * @param {Boolean} [options.sync] is the subject synchronous?
   * @return {Function} test(subject, reporter) runs the test defined here
   */
  function funTest (options) {
    options = validateOptions(defaults(options, defaultOptions))

    function toString (subject) {
      var string = ''
      var subjectString = subject ? stringify(subject) : 'subject'

      if (options.transformer !== identity) {
        subject = options.transformer.toString(subjectString)
      }

      string += subject + '(' + stringify(options.input) + ') -> '

      string += 'error should ' + stringify(options.error)

      if (options.result !== identity) {
        string += ', result should ' + stringify(options.result)
      }

      return string
    }

    function test (subject, reporter) {
      subject = transform(subject, options.transformer, options.sync)

      var timeout = setTimeout(
        function () {
          var error = new Error('Timeout of ' + timeout + ' exceeded.')

          reporter(error)
        },
        options.timeout
      )

      try {
        subject(options.input, function (error, result) {
          var assertionError = catchError(options.error, error)

          if (!assertionError) {
            assertionError = catchError(options.result, result)
          }

          clearTimeout(timeout)
          reporter(assertionError)
        })
      } catch (error) {
        var assertionError = catchError(options.error, error)

        reporter(assertionError)
        clearTimeout(timeout)
      }
    }

    test.toString = toString

    return test
  }

  function transform (subject, transformer, sync) {
    if (transformer) {
      subject = transformer(subject)
    }

    if (sync) {
      subject = syncToAsync(subject)
    }

    return subject
  }

  function syncToAsync (syncFunction) {
    return function (options, callback) {
      var result
      var error

      try {
        result = syncFunction(options)
      } catch (e) {
        error = e
      }

      callback(error, result)
    }
  }

  function catchError (aFunction, input) {
    var error

    try {
      aFunction(input)
    } catch (e) {
      error = e
    }

    return error
  }

  function identity (subject) {
    return subject
  }
})()

