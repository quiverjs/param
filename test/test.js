
'use strict'

var should = require('should')
var param = require('../lib/param')

describe('param test', function() {
  var paramSpecs = [
    {
      key: 'foo',
      required: true,
      valueType: 'string'
    },
    {
      key: 'bar',
      required: false,
      defaultValue: 'bar default'
    },
    {
      key: 'arr',
      required: false,
      valueType: 'array'
    },
    {
      key: 'obj',
      required: true,
      innerParam: [
        {
          key: 'func',
          required: true,
          valueType: 'function'
        }
      ]
    }
  ]

  var validateParam = param.createParamValidator(paramSpecs)

  it('success test 1', function() {
    var args = {
      foo: 'foo value',
      obj: {
        func: function() { }
      }
    }

    var err = validateParam(args)
    should.not.exist(err)
    args.bar.should.equal('bar default')
  })

  it('success test 2', function() {
    var args = {
      foo: 'foo value',
      bar: ['could', 'be', 'anything'],
      arr: [ ],
      obj: {
        func: function() { },
        extra: 'is ok'
      }
    }

    var err = validateParam(args)
    should.not.exist(err)
  })

  it('missing required', function() {
    var args = { }
    var err = validateParam(args)
    should.exist(err)
  })

  it('missing inner value', function() {
    var args = { 
      foo: 'foo value',
      obj: { }
    }
    var err = validateParam(args)
    should.exist(err)
  })

  it('wrong value type', function() {
    var args = {
      foo: 'foo value',
      arr: 'not an array',
      obj: { 
        func: function() { } 
      }
    }
    var err = validateParam(args)
    should.exist(err)
  })
})