;(function () {
  'use strict'

  /* imports */
  var Task = require('data.task')
  var funTry = require('fun-try')
  var id = require('fun-id')
  var compose = require('fun-compose')
  var object = require('fun-object')

  var merge = object.concat(function (a, b) {
    return a === undefined ? b : a
  })

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
        .map(object.of('data'))
        .map(merge(options))
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
    config = merge(defaultConfig, config)
    return function (options) {
      return Task.of(options)
        .map(object.keep(['data', 'subject']))
        .map(object.ap({ data: config.mapData, subject: config.mapSubject }))
        .chain(funTry(config.action))
        .chain(id)
        .chain(funTry(config.assertion))
        .map(object.of('result'))
        .orElse(compose(Task.of, object.of('error')))
        .map(merge({ data: options.data, subject: options.subject }))
        .map(merge(config))
        .map(passThrough(options.reporter))
        .map(object.keep(['data', 'result', 'error']))
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

