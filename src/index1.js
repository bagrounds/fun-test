;(function () {
  'use strict'

  /* imports */
  var Task = require('data.task')
  var R = require('ramda')
  var arrow = require('fun-arrow')
  var funTry = require('fun-try')
  var taskTimeout = require('task-timeout')
  var defaultStageOptions = require('./default-stage')

  /* exports */
  module.exports = funTest
  module.exports.makeStage = makeStage

  /**
   *
   * @param {[Object]} stages - that define this test
   * @return {Function} subject -> Task stages
   */
  function funTest (stages) {
    return function (subject) {
      stages.map(function (stage) {
        return new Task(function (onError, onResult) {
          stage
        })
      })
    }
  }

  /**
   *
   * @param {Object} options - all function parameters
   * @param {Function} options.input - state -> input
   * @param {Function} options.action - (subject, input) -> Task output
   * @param {Function} options.update - (output, state) -> state
   * @param {Function} options.assertion - state -> state
   * @param {Number} options.timeout - milliseconds
   * @param {Boolean} options.shouldThrow - true if this stage should throw
   *
   * @return {Function} subject -> Task state
   */
  function makeStage (options) {
    options = R.merge(defaultStageOptions, options)

    return function (subject) {
      var task = Task.of(options.state)
        .map(debug('state:'))
        .map(options.input)
        .map(debug('input:'))
        .chain(R.curry(options.action)(subject))
        .map(R.repeat(R.__, 2))
        .map(debug('split:'))
        .map(arrow.second(R.always(options.state)))
        .map(debug('second:'))
        .map(arrow.merge(options.update))
        .chain(funTry(options.assertion))

      return taskTimeout(task, options.timeout)
    }
  }

  function debug (message) {
    return function (subject) {
      console.log(message, subject)

      return subject
    }
  }
})()

