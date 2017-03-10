;(function () {
  'use strict'

  /* imports */
  var funAssert = require('fun-assert')
  var Task = require('data.task')
  var R = require('ramda')
  var arrow = require('fun-arrow')
  var funTry = require('fun-try')
  var taskTimeout = require('task-timeout')
  var defaultStageOptions = require('./default-stage')
  var guarded = require('guarded')

  var INPUT_TYPE = 'Array<Array<{ ' +
    'input: Maybe function, ' +
    'assertion: Maybe function, ' +
    'timeout: Maybe Number, ' +
    'action: Maybe function, ' +
    'update: Maybe function, ' +
    'shouldThrow: Maybe Boolean ' +
    ' }>>'

  /* exports */
  module.exports = guarded({
    inputs: [funAssert.type(INPUT_TYPE)],
    f: funTest,
    output: funAssert.type('Function')
  })

  module.exports.makeStage = makeStage

  function funTest (tests) {
    return function testSuite (subject, reporter) {
      return tests
        .map(makeTest)
        .map(R.apply(R.__, [subject, reporter]))
        .reduce(function (t1, t2) {
          return t1.chain(R.always(t2))
        }, Task.of())
    }
  }

  /**
   *
   * @param {[Object]} stages - that define this test
   * @return {Function} subject -> Task stages
   */
  function makeTest (stages) {
    return function test (subject, reporter) {
      return stages
        .map(makeStage)
        .map(R.apply(R.__, [subject, reporter]))
        .reduce(function (s1, s2) {
          return s1.chain(s2)
        }, Task.of())
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
   * @return {Function} (subject, reporter) -> state -> Task state
   */
  function makeStage (options) {
    options = R.merge(defaultStageOptions, options)

    return function stage (subject, reporter) {
      return function transition (state) {
        var task = Task.of(state)
          .map(options.input)
          .chain(R.curry(options.action)(subject))
          .map(R.repeat(R.__, 2))
          .map(arrow.second(R.always(state)))
          .map(arrow.merge(options.update))
          .chain(funTry(options.assertion))

        return taskTimeout(task, options.timeout)
          .map(R.objOf('state'))
          .map(R.merge({ options: options }))
          .map(reporter)
          .map(R.prop('state'))
          .chain(Task.of)
      }
    }
  }
})()

