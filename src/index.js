;(function () {
  'use strict'

  /* imports */
  var Task = require('data.task')
  var funTry = require('fun-try')
  var id = require('fun-id')
  var compose = require('fun-compose')
  var R = require('ramda')

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
   * @param {Function} config.action - ({ Data, Subject }) -> Task Data
   * @param {Function} config.assertion - Data -> Data | throws
   * @param {Number} config.timeout - in ms
   *
   * @return ({data, subject, reporter}) -> Task Data
   */
  function of (config) {
    return function (options) {
      return Task.of(options)
        .map(R.pick(['data', 'subject']))
        .chain(funTry(config.action))
        .chain(id)
        .chain(funTry(config.assertion))
        .map(options.reporter.success)
        .orElse(compose(Task.of, options.reporter.error))
    }
  }

  function empty () {
    return function (options) {
      return Task.of(options.data)
    }
  }
})()

