#!/usr/bin/env node
;(function () {
  'use strict'

  /* imports */
  var tests = require('./tests')
  var subject = require('../src/index1.js')
  var stringify = require('stringify-anything')

  main()

  function main () {
    tests(subject, reporter).fork(testSuiteError, id)
  }

  function testSuiteError (error) {
    console.log('TestSuiteError:', error)
  }

  function reporter (options) {
    var report = stringify(options.options.input) + ' -> ' +
      stringify(options.options.action) + ' -> ' +
      stringify(options.options.update) + ' -> ' +
      stringify(options.options.assertion) + ' -> ' +
      stringify(options.state)

    console.log(report)
    return options
  }

  function id (x) {
    return x
  }
})()

