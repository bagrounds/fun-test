;(function () {
  'use strict'

  /* imports */
  var Task = require('data.task')
  var funAssert = require('fun-assert')
  var lens = require('fun-lens')
  var compose = require('fun-compose')
  var id = require('fun-id')
  var K = require('fun-constant')
  var object = require('fun-object')

  var objectMerge = object.concat(function (a, b) {
    return a === undefined ? b : a
  })

  function merge (options) {
    return objectMerge(options.data || {}, options.result || {})
  }

  /* exports */
  module.exports = [
    [
      {
        mapData: K(5),
        action: function apply5 (options) {
          return Task.of(options.subject(5))
        },
        assertion: funAssert.equal(25)
      }
    ],
    [
      {
        comment: 'multistage',
        mapData: K({ a: 'a' }),
        update: merge
      },
      {
        action: function (options) {
          return Task.of({ b: 'b' })
        },
        update: merge
      },
      {
        action: function (options) {
          return Task.of({ c: 'c' })
        },
        update: merge
      },
      {
        mapData: object.keep(['b']),
        action: function (options) {
          return Task.of(options.data)
        },
        update: merge
      },
      {
        action: function (options) {
          return Task.of(options.data)
        }
      }
    ],
    [
      {
        comment: 'setting up',
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
        comment: 'tearing down',
        action: function allDone (options) {
          return Task.of('all done')
        },
        assertion: id
      }
    ]
  ]
})()

