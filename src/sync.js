;(function () {
  'use strict'

  /* imports */
  var stringify = require('stringify-anything')

  /* exports */
  module.exports = sync

  /**
   *
   * @param {Object} options all input parameters
   * @param {Array} [options.input] argument list to test function on
   * @param {Function} [options.result] assertion to apply to result
   * @param {Function} [options.error] assertion to apply to error
   * @param {Function} [options.transform] to apply before testing
   *
   * @return {Function} to run the defined test on a subject
   */
  function sync (options) {
    var toString = makeToString(options)

    function test (subject) {
      subject = options.transform ? options.transform(subject) : subject

      try {
        options.result(subject.apply(null, options.input))
      } catch (error) {
        options.error(error)
      }

      return toString(subject)
    }

    test.toString = toString

    return test
  }

  function makeToString (options) {
    return function toString (subject) {
      var string = ''
      var subjectString = subject ? stringify(subject) : 'subject'

      if (options.transformer) {
        subjectString = stringify(options.transformer, subject)
      }

      string += subjectString + '(' + stringify(options.input) + ') -> '

      string += 'error should ' + stringify(options.error)

      if (options.result) {
        string += ', result should ' + stringify(options.result)
      }

      return string
    }
  }
})()

