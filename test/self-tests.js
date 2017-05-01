;(function () {
  'use strict'

  /* imports */
  var Task = require('data.task')
  var funAssert = require('fun-assert')
  var K = require('fun-constant')
  var object = require('fun-object')
  var fn = require('fun-function')
  var lens = require('fun-lens')
  var arrange = require('fun-arrange')

  /* exports */
  module.exports = [
    [
      {
        mapData: K([
          {
          }
        ]),
        mapSubject: object.get('of'),
        action: fn.compose(Task.of, fn.applyFrom({
          inputs: arrange(['data']),
          f: lens.get(['subject'])
        })),
        assertion: funAssert.type('Function')
      },
      {
        action: function getTaskOfTest (options) {
          return Task.of(options.data({
            data: 2,
            subject: square,
            reporter: Task.of
          }))
        },
        assertion: function (thing) {
          if (!(thing instanceof Task)) {
            throw Error('Expected a Task, but found: ' + thing)
          }

          return thing
        }
      }
    ]
  ]

  function square (x) {
    return x * x
  }
})()

