;(function () {
  'use strict'

  /* imports */
  var predicate = require('fun-predicate')
  var object = require('fun-object')
  var funTest = require('../src')
  var arrange = require('fun-arrange')
  var fn = require('fun-function')
  var array = require('fun-array')

  /* exports */
  var async = [
    [[0, 1], predicate.equal(1)],
    [[3, 4], predicate.equal(7)],
    [[2, 6], predicate.equal(8)],
    [[9, -3], predicate.equal(6)]
  ].map(arrange({ inputs: 0, predicate: 1, contra: 2 }))
    .map(object.ap({
      predicate: fn.contramap(array.get(1))
    }))
    .map(object.set('contra', object.get('addAsync')))
    .map(funTest.async)

  var sync = [
    [[0, 1], 1],
    [[3, 4], 7],
    [[2, 6], 8],
    [[9, -3], 6]
  ].map(arrange({ inputs: 0, predicate: 1 }))
    .map(object.ap({ predicate: predicate.equal }))
    .map(object.set('contra', object.get('add')))
    .map(funTest.sync)

  /* exports */
  module.exports = sync.concat(async)
})()

