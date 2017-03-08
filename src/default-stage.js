;(function () {
  'use strict'

  /* imports */
  var funAssert = require('fun-assert')
  var Task = require('data.task')

  /* exports */
  module.exports = {
    action: defaultAction,
    update: defaultUpdate,
    assertion: funAssert.pass(),
    timeout: 60000,
    shouldThrow: false
  }

  function defaultAction (subject, input) {
    return new Task(function (onError, onSuccess) {
      onSuccess(subject.apply(null, input))
    })
  }

  function defaultUpdate (output, state) {
    return output
  }
})()

