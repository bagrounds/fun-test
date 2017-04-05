;(function () {
  'use strict'

  /* imports */
  var flip = require('fun-flip')
  var curry = require('fun-curry')
  var Task = require('data.task')
  var funTry = require('fun-try')
  var id = require('fun-id')
  var compose = require('fun-compose')

  /* exports */
  module.exports = {
    concat: concat,
    of: of,
    empty: empty
  }

  function concat (t1, t2) {
    return function (state, subject, reporter) {
      return t1(state, subject, reporter)
        .chain(curry(flip(t2))(reporter, subject))
    }
  }

  /**
   *
   * @param {Object} options - all function parameters
   * @param {Function} options.action - State -> Task State
   * @param {Function} options.assertion - State -> State | throws
   * @param {Boolean} options.report - show this stage to reporter
   * @param {Number} options.timeout - in ms
   *
   * @return (state, subject, reporter) -> Task State
   */
  function of (options) {
    return function (state, subject, reporter) {
      return funTry(options.action)(state, subject)
        .chain(id)
        .chain(funTry(options.assertion))
        .map(reporter.success)
        .orElse(compose(Task.of, reporter.error))
    }
  }

  function empty () {
    return function (state, subject, reporter) {
      return Task.of(state)
    }
  }
})()

