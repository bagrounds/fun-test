#!/usr/bin/env node
;(function () {
  'use strict'

  /* imports */
  var tests = require('fun-test-tests')
  var funTestRunner = require('fun-test-runner')

  var subject = require('../src/index.js')

  main()

  function main () {
    var options = {
      subject: subject,
      tests: tests
    }

    funTestRunner(options, function (error) {
      error && console.error(error)

      console.log('done')
    })
  }
})()

