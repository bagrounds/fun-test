/**
 *
 * @module fun-test
 */
;(function () {
  'use strict'

  /* imports */
  var fn = require('fun-function')
  var array = require('fun-array')
  var setProp = require('set-prop')
  var stringify = require('stringify-anything')
  var object = require('fun-object')
  var async = require('fun-async')

  var defaultSync = {
    contra: fn.id,
    inputs: [],
    action: fn.apply
  }

  var defaultAsync = {
    contra: fn.id,
    inputs: [null],
    action: fn.apply
  }

  /* exports */
  module.exports = {
    sync: fn.compose(testSync, object.defaults(defaultSync)),
    async: fn.compose(testAsync, object.defaults(defaultAsync))
  }

  /**
   *
   * @function module:fun-test.async
   *
   * @param {Object} options - all input parameters
   * @param {Function} options.predicate - to apply to callback arguments
   * @param {Function} [options.contra] - to apply to subject prior to calling
   * @param {Function} [options.action] - to use instead of apply
   * @param {Array} [options.inputs] - to apply to contra(subject)
   *
   * @return {Function} (subject, callback) ~> [Error, Boolean]
   */
  function testAsync (options) {
    return setProp('name', nameFunction(options), function (subject, callback) {
      options.action(array.append(cb, options.inputs), options.contra(subject))

      function cb () {
        callback(null, options.predicate(array.from(arguments)))
      }
    })
  }

  /**
   *
   * @function module:fun-test.testSync
   *
   * @param {Object} options - all input parameters
   * @param {Function} options.predicate - to apply to callback arguments
   * @param {Function} [options.contra] - to apply to subject prior to calling
   * @param {Function} [options.action] - to use instead of apply
   * @param {Array} [options.inputs] - to apply to contra(subject)
   *
   * @return {Function} (subject, callback) ~> [Error, Boolean]
   */
  function testSync (options) {
    return setProp('name', nameFunction(options), async.of(fn.composeAll([
      options.predicate,
      options.action(options.inputs),
      options.contra
    ])))
  }

  /**
   *
   * @param {Object} options - all input parameters
   * @param {Function} options.predicate - to apply to results
   * @param {Function} options.contra - to apply to subject prior to calling
   * @param {Array} options.inputs - to apply to contra(subject)
   *
   * @return {String} representation of test function
   */
  function nameFunction (options) {
    return options.predicate.name + '.apply(' +
      stringify(options.inputs) + ').' + options.contra.name
  }
})()

