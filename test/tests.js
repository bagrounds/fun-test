;(function () {
  'use strict'

  /* imports */
  // var Task = require('data.task')
  // var fn = require('fun-function')
  var predicate = require('fun-predicate')
  var object = require('fun-object')
  var funTest = require('../src')
  var arrange = require('fun-arrange')
  // var array = require('fun-array')

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

  // module.exports = [
    // funTest.sync({
      // predicate: predicate.equal(7),
      // inputs: [3, 4],
      // contra: object.get('add')
    // }),
    // fn.composeAll([
      // Task.of,
      // predicate.equal(3),
      // fn.apply([1, 2]),
      // object.get('add')
    // ]),
    // fn.composeAll([
      // Task.of,
      // predicate.equal(5),
      // fn.apply([2, 3]),
      // object.get('add')
    // ]),
    // fn.composeAll([
      // Task.of,
      // predicate.equal(3),
      // fn.apply([2, 1]),
      // object.get('add')
    // ])
  // ]
})()

