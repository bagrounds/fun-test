/**
 *
 * @module fun-test
 */
;(() => {
  'use strict'

  /* imports */
  const { id, apply, pipe, compose, composeAll } = require('fun-function')
  const setProp = require('set-prop')
  const stringify = require('stringify-anything')
  const { map, ap, defaults: objDefaults } = require('fun-object')
  const { of: asyncOf } = require('fun-async')
  const { inputs, output } = require('guarded')
  const { array, fun, tuple, record } = require('fun-type')

  const defaults = { contra: id, inputs: [], action: apply }

  const nameFunction = ({ predicate, contra, inputs, action }) =>
    stringify(composeAll([predicate, action(inputs), contra]))

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
  const async = ({ predicate, action, inputs, contra }) => setProp(
    'name',
    nameFunction({ predicate, action, inputs, contra }),
    (subject, callback) => action(
      [...inputs, (...args) => callback(null, predicate(args))],
      contra(subject)
    )
  )

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
   * @return {Function} (subject, callback) ~> [Error, Boolean]
   */
  const sync = ({ predicate, action, inputs, contra }) => setProp(
    'name',
    nameFunction({ predicate, action, inputs, contra }),
    asyncOf(composeAll([predicate, action(inputs), contra]))
  )

  /* exports */
  const api = { sync, async }

  const guards = map(compose(output(fun)), {
    sync: inputs(tuple([record({
      predicate: fun,
      action: fun,
      inputs: array,
      contra: fun
    })])),
    async: inputs(tuple([record({
      predicate: fun,
      action: fun,
      inputs: array,
      contra: fun
    })]))
  })

  module.exports = map(pipe(objDefaults(defaults)), ap(guards, api))
})()

