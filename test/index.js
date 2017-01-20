#!/usr/bin/env node
;(function () {
  'use strict'

  /* imports */
  var tests = require('fun-test-tests')
  var funTestRunner = require('fun-test-runner')

  var subject = require('../src/')

  main()

  function main () {
    funTestRunner({
      subject: subject,
      tests: tests
    })
  }
})()

