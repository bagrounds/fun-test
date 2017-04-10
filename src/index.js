;(function () {
  'use strict'

  /* imports */
  var Task = require('data.task')
  var funTry = require('fun-try')
  var id = require('fun-id')
  var compose = require('fun-compose')
  var R = require('ramda')
  var object = require('fun-object')

  var defaultConfig = {
    mapData: id,
    mapSubject: id,
    action: function (options) {
      return Task.of(options.data)
    },
    update: function (options) {
      return options.result
    },
    assertion: id
  }

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
   * @param {Function} config.mapData - Data -> Data
   * @param {Function} config.mapSubject - Subject -> Subject
   * @param {Function} config.action - ({ Data, Subject }) -> Task Result
   * @param {Function} config.assertion - Data -> Data | throws
   * @param {Function} config.update - ({ Data, Result }) -> Data
   * @param {String} config.comment - for the reporter
   * @param {Number} config.timeout - in ms
   *
   * @return ({data, subject, reporter}) -> Task Data
   */
  function of (config) {
    config = R.merge(defaultConfig, config)
    return function (options) {
      return Task.of(options)
        .map(R.pick(['data', 'subject']))
        .map(object.ap({ data: config.mapData, subject: config.mapSubject }))
        .chain(funTry(config.action))
        .chain(id)
        .chain(funTry(config.assertion))
        .map(R.objOf('result'))
        .orElse(compose(Task.of, R.objOf('error')))
        .map(R.merge({ data: options.data, subject: options.subject }))
        .map(R.merge(config))
        .map(passThrough(options.reporter))
        .map(R.pick(['data', 'result', 'error']))
        .map(config.update)
    }
  }

  function passThrough (f) {
    return function (subject) {
      f(subject)

      return subject
    }
  }

  function empty () {
    return function (options) {
      return Task.of()
    }
  }
})()

