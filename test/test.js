
var assert = require('assert')
var defineParam = require('../lib/param.js').defineParam

var default1 = defineParam()
  .required('foo')
  .required('bar', function(arg) {
    return (arg == 'bar') ? null : 'err'
  })
  .optional('baz', 'baz')
  .optional('blah')

var test1 = function(def) {
  var args = {
    foo: 'test',
    bar: 'bar'
  }
  def.parseArgs(args)
  assert.equal(args.baz, 'baz')
  assert.equal(args.blah, undefined)
}

var test2 = function(def) {
  var args = {
    bar: 'bar'
  }
  assert.throws(function() {
    def.parseArgs(args)
  })
}

var test3 = function(def) {
  var args = {
    foo: 'foo',
    bar: 'baz'
  }

  assert.throws(function() {
    def.parseArgs(args)
  })
}

var test = function(def) {
  test1(def)
  test2(def)
  test3(def)
}

test(default1)