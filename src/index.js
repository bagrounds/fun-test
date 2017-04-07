;(function () {
  'use strict'

  /* imports */
  var Task = require('data.task')
  var funTry = require('fun-try')
  var id = require('fun-id')
  var compose = require('fun-compose')
  var R = require('ramda')
  var apply = require('fun-apply')
  var lens = require('fun-lens')
  var funCase = require('fun-case')
  var funPredicate = require('fun-predicate')

  /* exports */
  module.exports = {
    concat: concat,
    of: of,
    empty: empty
  }

  function concat (t1, t2) {
    return function (options) {
      return Task.of(options)
        .chain(t1)
        .map(R.objOf('data'))
        .map(R.merge(options))
        .chain(t2)
    }
  }

  /**
   *
   * @param {Object} config - all function parameters
   * @param {Function} [config.action] - ({ Data, Subject }) -> Task Data
   * @param {Array} [config.inputs] - to call subject with
   * @param {Function} config.assertion - Data -> Data | throws
   * @param {Number} config.timeout - in ms
   *
   * @return ({data, subject, reporter}) -> Task Data
   */
  function of (config) {
    return funCase([
      {
        p: compose(funPredicate.type('Array'), lens.get(['inputs'])),
        f: ofInputs
      },
      {
        p: funPredicate.yes(),
        f: ofAction
      }
    ])(config)
  }

  function ofInputs (config) {
    return ofAction(R.merge(config, { action: actionApply(config.inputs) }))
  }

  function ofAction (config) {
    return function (options) {
      return Task.of(options)
        .map(R.pick(['data', 'subject']))
        .chain(funTry(config.action))
        .chain(id)
        .chain(funTry(config.assertion))
        .map(R.objOf('data'))
        .orElse(compose(Task.of, R.objOf('error')))
        .map(R.merge({ previous: options.data }))
        .map(R.merge(config))
        .map(R.merge(options))
        .map(options.reporter)
    }
  }

  function actionApply (input) {
    return [Task.of, apply(input), lens.get(['subject'])].reduce(compose)
  }

  function empty () {
    return function (options) {
      return Task.of(options.data)
    }
  }
})()

