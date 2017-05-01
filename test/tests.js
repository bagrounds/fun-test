;(function () {
  'use strict'

  /* imports */
  var predicate = require('fun-predicate')
  var object = require('fun-object')
  var funTest = require('../src')
  var arrange = require('fun-arrange')

  /* exports */
  module.exports = [
    [[0, 1], 1],
    [[3, 4], 7],
    [[2, 6], 8],
    [[9, -3], 6]
  ].map(arrange({ inputs: 0, predicate: 1 }))
    .map(object.ap({ predicate: predicate.equal }))
    .map(object.set('contra', object.get('add')))
    .map(funTest.sync)
})()

