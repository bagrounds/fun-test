/**
 *
 * @module fun-test
 */
;(function () {
  'use strict'

  /* imports */
  var Task = require('data.task')
  var funTry = require('fun-try')
  var compose = require('fun-compose')
  var object = require('fun-object')
  var fn = require('fun-function')

  var merge = object.concat(function (a, b) {
    return b === undefined ? a : b
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
    of: compose(of, merge(defaultConfig)),
    empty: empty,
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
   * @function module:fun-test.of
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
   * @return {Function} ({data, subject, reporter}) -> Task Data
   */
  function of (config) {
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
        .chain(options.reporter)
        .map(object.keep(['data', 'result', 'error']))
        .map(config.update)
    }
  }

  function empty () {
    return function (options) {
      return Task.of()
    }
  }

  function id (x) {
    return x
  }
})()

