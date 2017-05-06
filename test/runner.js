;(function () {
  'use strict'

  /* imports */
  var Task = require('data.task')
  var fn = require('fun-function')
  var array = require('fun-array')

  /* exports */
  module.exports = fn.curry(runner)

  function runner (tests, subject) {
    return fn.compose(
      array.fold(
        combine,
        init,
        tests.map(embelish)
      ),
      lift
    )(subject)

    function init (subject) {
      return new Task(function (onError, onSuccess) {
        console.log('1..' + tests.length)
        onSuccess(subject)
      })
    }

    function lift (s) {
      return [0, s]
    }

    function combine (t1, t2) {
      return function (s) {
        return t1(s).chain(t2)
      }
    }
  }

  function embelish (test) {
    return function (pair) {
      return test(pair[1])
        .map(lift)
        .chain(report)

      function lift (x) {
        return [pair[0] + 1, pair[1], x, test]
      }
    }
  }

  function report (result) {
    var message = (result[2] ? 'ok' : 'not ok') +
      ' ' + result[0] + ' - ' + result[3].name

    console.log(message)

    return Task.of(result)
  }
})()

