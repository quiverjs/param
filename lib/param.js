
'use strict'

var error = require('quiver-error').error
var copyObject = require('quiver-copy').copyObject

var validateParamSpec = function(paramSpec, args) {
  var key = paramSpec.key
  var value = args[key]
  var hasKey = (key in args) && value != undefined && value != null

  if(!hasKey) {
    if(paramSpec.required) return error(400, 
      'missing required parameter ' + key)

    if(paramSpec.defaultValue) {
      args[key] = paramSpec.defaultValue
    }

    return null
  }

  var valueType = paramSpec.valueType
  if(valueType && 
      !( (valueType == 'array' && Array.isArray(value)) ||
          typeof(value) == valueType
       ))
  {
    return error(400, 'value of ' + key + 
      ' must be of of type ' + valueType)
  }

  var innerParam = paramSpec.innerParam
  if(innerParam) return validateParam(innerParam, value)

  return null
}

var validateParam = function(paramSpecs, args) {
  for(var i=0; i<paramSpecs.length; i++) {
    var err = validateParamSpec(paramSpecs[i], args)
    if(err) return err
  }
}

var createParamValidator = function(paramSpecs) {
  paramSpecs = copyObject(paramSpecs)

  return function(args) {
    return validateParam(paramSpecs, args)
  }
}

module.exports = {
  validateParam: validateParam,
  createParamValidator: createParamValidator
}