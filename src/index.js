/**
 * fun-test is a simple function tester.
 *
 * @module fun-test
 */
;(function () {
  'use strict'

  /* imports */

  /* exports */
  module.exports = funTest

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
    options.fut(options.input, function (error, result) {
      var verifierOptions = {
        error: error,
        result: result
      }

      options.verifier(verifierOptions, reporter)
    })
  }
})()

