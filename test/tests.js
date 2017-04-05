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
        action: function action (state, subject) {
          return Task.of({ input: 4 })
        },
        assertion: funAssert.type('Object')
      },
      {
        action: function action (state, subject) {
          state.result = subject(state.input)
          // throw Error('shit blew up')

          return Task.of(state)
        },
        assertion: compose(
          funAssert.type('Number'),
          lens.get(['result'])
        )
      },
      {
        action: function action (state, subject) {
          return Task.of('all done')
        },
        assertion: id
      }
    ]
  ]
})()

