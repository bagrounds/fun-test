;(() => {
  'use strict'

  /* imports */
  const { equal } = require('fun-predicate')
  const { set, ap, get } = require('fun-object')
  const { async, sync } = require('..')
  const arrange = require('fun-arrange')
  const { composeAll, contramap, k } = require('fun-function')
  const { concat, map } = require('fun-array')

  const mockSubject = {
    add: (a, b) => a + b,
    addAsync: (a, b, callback) => callback(null, a + b)
  }

  /* exports */
  const asyncTests = map(
    composeAll([
      async,
      set('contra', k(get('addAsync', mockSubject))),
      ap({ predicate: contramap(get(1)) }),
      arrange({ inputs: 0, predicate: 1, contra: 2 })
    ]),
    [
      [[0, 1], equal(1)],
      [[3, 4], equal(7)],
      [[2, 6], equal(8)],
      [[9, -3], equal(6)]
    ]
  )

  const syncTests = map(
    composeAll([
      sync,
      set('contra', k(get('add', mockSubject))),
      ap({ predicate: equal }),
      arrange({ inputs: 0, predicate: 1 })
    ]),
    [
      [[0, 1], 1],
      [[3, 4], 7],
      [[2, 6], 8],
      [[9, -3], 6]
    ]
  )

  /* exports */
  module.exports = concat(syncTests, asyncTests)
})()

