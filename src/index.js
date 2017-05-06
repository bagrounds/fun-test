/**
 *
 * @module fun-test
 */
;(function () {
  'use strict'

  /* imports */
  var Task = require('data.task')
  var fn = require('fun-function')

  /* exports */
  module.exports = {
    sync: sync
  }

  /**
   *
   * @function module:fun-test.sync
   *
   * @param {Object} options - all input parameters
   * @param {Function} options.predicate - to check result
   * @param {Array} options.inputs - to feed to test function
   * @param {Function} options.action - to use instead of apply
   * @param {Function} options.contra - preapplied ot subject
   *
   * @return {Function} subject -> Task(Boolean)
   */
  function sync (options) {
    return fn.composeAll([
      Task.of,
      options.predicate,
      (options.action || fn.apply)(options.inputs),
      (options.contra || fn.id)
    ])
  }
})()

