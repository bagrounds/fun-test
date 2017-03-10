;(function () {
  'use strict'

  var Task = require('data.task')
  var funTest = require('../src/index1.js')
  var funAssert = require('fun-assert')
  var R = require('ramda')

  module.exports = funTest([
    [
      {
        input: R.always([[[
          {
            input: R.always([4])
          }
        ]]]),
        assertion: funAssert.type('Function')
      },
      {
        action: function testDouble (subject, input) {
          return Task.of(input(R.compose(Task.of, double), R.identity))
        },
        assertion: funAssert.type('Object')
      }
    ]
  ])

  function double (x) {
    return 2 * x
  }
})()

