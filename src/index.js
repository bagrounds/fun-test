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

  var DEFAULT_TIMEOUT = 1000
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
   * @param {Number} [options.timeout] ms to wait for callback to be called
   * @param {Boolean} [options.sync] is the subject synchronous?
   * @return {Function} test(subject, reporter) runs the test defined here
   */
  function funTest (options) {
    validateOptions(options)

    var input = options.input
    var verifier = options.verifier
    var transformer = options.transformer
    var timeout = options.timeout || DEFAULT_TIMEOUT

    return function test (subject, reporter) {
      if (options.sync) {
        var original = subject
        subject = function (options, callback) {
          try {
            var result = original(options)
            callback(null, result)
          } catch (error) {
            callback(error)
          }
        }
      }

      if (transformer) {
        subject = transformer(subject)
      }

      validateTestInput({
        subject: subject,
        reporter: reporter
      })

      var executeOptions = {
        subject: subject,
        input: input,
        verifier: verifier,
        timeout: timeout
      }

      execute(executeOptions, reporter)
    }
  }

  function execute (options, reporter) {
    var timeout = setTimeout(function () {
      var error = new Error('Timeout of ' + options.timeout + ' exceeded.')

      reporter(error)
    }, options.timeout)

    function verifierRunner (error, result) {
      clearTimeout(timeout)

      try {
        options.verifier(error, result)
      } catch (e) {
        reporter(e)
        return
      }

      reporter()
    }

    try {
      options.subject(options.input, verifierRunner)
    } catch (error) {
      verifierRunner(error)
    }
  }
})()

