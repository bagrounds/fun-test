;(function () {
  'use strict'

  /* imports */
  var Task = require('data.task')
  var funAssert = require('fun-assert')
  var lens = require('fun-lens')
  var compose = require('fun-compose')
  var id = require('fun-id')

  /* exports */
  module.exports = [
    [
      {
        inputs: [5],
        assertion: funAssert.equal(25)
      }
    ],
    [
      {
        action: function getInput4 (options) {
          return Task.of({ input: 4 })
        },
        assertion: funAssert.type('Object')
      },
      {
        action: function applySubjectToDataInput (options) {
          return Task.of({
            result: options.subject(options.data.input)
          })
        },
        assertion: compose(
          funAssert.type('Number'),
          lens.get(['result'])
        )
      },
      {
        action: function allDone (options) {
          return Task.of('all done')
        },
        assertion: id
      }
    ]
  ]
})()

