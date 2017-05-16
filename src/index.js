/**
 *
 * @module fun-test
 */
;(function () {
  'use strict'

  /* imports */
  var Task = require('data.task')
  var fn = require('fun-function')
  var array = require('fun-array')
  var setProp = require('set-prop')
  var stringify = require('stringify-anything')
  var object = require('fun-object')

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
    sync: fn.compose(sync, object.defaults(defaultSync)),
    async: fn.compose(async, object.defaults(defaultAsync))
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
   * @return {Function} subject -> Task(Boolean)
   */
  function async (options) {
    return setProp('name', nameFunction(options), function (subject) {
      return new Task(function (onError, onSuccess) {
        function callback () {
          onSuccess(options.predicate(array.from(arguments)))
        }

        options.action(
          array.append(callback, options.inputs),
          options.contra(subject)
        )
      })
    })
  }

  /**
   *
   * @function module:fun-test.sync
   *
   * @param {Object} options - all input parameters
   * @param {Function} options.predicate - to apply to callback arguments
   * @param {Function} [options.contra] - to apply to subject prior to calling
   * @param {Function} [options.action] - to use instead of apply
   * @param {Array} [options.inputs] - to apply to contra(subject)
   *
   * @return {Function} subject -> Task(Boolean)
   */
  function sync (options) {
    return setProp('name', nameFunction(options), fn.composeAll([
      Task.of,
      options.predicate,
      options.action(options.inputs),
      options.contra
    ]))
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

