#!/usr/bin/env node
;(() => {
  'use strict'

  /* imports */
  const runner = require('fun-test-runner')
  const tests = require('./tests')
  const subject = require('..')

  runner({ tests, subject }, (error, result) => {
    error && console.error(error)
    console.log(result)
  })
})()

