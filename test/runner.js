;(function () {
  'use strict'

  /* imports */
  var fn = require('fun-function')
  var async = require('fun-async')
  var object = require('fun-object')
  var scalar = require('fun-scalar')

  /* exports */
  module.exports = fn.curry(runner)

  function runner (options, callback) {
    console.log('1..' + options.tests.length)

    var input = {
      subject: options.subject,
      number: 0
    }

    async.composeAll(
      options.tests.map(lift)
    )(input, callback)

    function lift (test) {
      return function (options, callback) {
        test(options.subject, function (error, result) {
          if (error) {
            throw error
          }
          callback(
            error,
            fn.compose(fn.tee(report), object.ap({
              number: scalar.sum(1),
              result: fn.k(result),
              test: fn.k(test)
            }))(options)
          )
        })
      }
    }
  }

  function report (result) {
    var message = (result.result ? 'ok' : 'not ok') +
      ' ' + result.number + ' - ' + result.test.name

    console.log(message)
  }
})()

