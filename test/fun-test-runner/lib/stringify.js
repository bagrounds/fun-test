/**
 *
 * @module fun-curry
 */
;(function () {
  'use strict'

  /* imports */
  var stringifySafe = require('json-stringify-safe')

  /* exports */
  module.exports = stringify

  function stringify (anything) {
    return stringifySafe(anything, function (key, value) {
      return (typeof value === 'function')
        ? '[' + (value.name || '=>') + ']'
        : value
    })
  }
})()

