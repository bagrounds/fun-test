#!/usr/bin/env node
;(function () {
  'use strict'

  /* imports */
  var funTestTests = require('fun-test-tests')
  var funTestRunner = require('fun-test-runner')

  var fut = require('../src/index.js')

  main()

  function main () {
    var options = {
      fut: fut,
      testSuite: funTestTests
    }

    funTestRunner(options, function (error) {
      error && console.error(error)

      console.log('done')
    })
  }
})()

