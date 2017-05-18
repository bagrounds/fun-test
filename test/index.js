;(function () {
  'use strict'

  /* imports */
  var tests = require('./tests')
  var runner = require('./runner')

  var subject = {
    add: function (a, b) {
      return a + b
    },
    addAsync: function (a, b, callback) {
      callback(null, a + b)
    }
  }

  main()

  function main () {
    runner({ tests: tests, subject: subject }, function (error) {
      if (error) {
        throw error
      }
    })
  }
})()

