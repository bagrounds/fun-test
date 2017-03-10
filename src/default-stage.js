;(function () {
  'use strict'

  /* imports */
  var funAssert = require('fun-assert')
  var Task = require('data.task')

  /* exports */
  module.exports = {
    input: identity,
    action: applyTask,
    update: output,
    assertion: funAssert.pass(),
    timeout: 1000,
    shouldThrow: false
  }

  function applyTask (subject, input) {
    return new Task(function (onError, onSuccess) {
      onSuccess(subject.apply(null, input))
    })
  }

  function output (output, state) {
    return output
  }

  function identity (x) {
    return x
  }
})()

