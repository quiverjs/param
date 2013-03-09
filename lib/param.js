
var defineParam = function(options) {
  if(!options) options = { }
  var requiredArgs = options.required || []
  var optionalArgs = options.optional || []

  var self = { }

  self.parseArgs = function(args) {
    if(!args) args = { }

    requiredArgs.forEach(function(required) {
      var key = required.key
      var validator = required.validator

      if(!(key in args)) throw new Error(
        'Missing required argument ' + key)

      if(validator) {
        var err =  validator(args[key])
        if(err) throw new Error(
          'Invalid argument ' + key + ': ' + err)
      }
    })

    optionalArgs.forEach(function(optional) {
      var key = optional.key
      var defaultValue = optional.defaultValue
      var validator = optional.validator

      if(!(key in args)) {
        args[key] = defaultValue
      } else if(validator) {
        var err = validator(args[key])
        if(err) throw new Error(
          'Invalid argument ' + key + ': ' + err)
      }
    })

    return args
  }

  self.required = function(key, validator) {
    if(!key) throw new Error('key must be provided')

    requiredArgs.push({
      key: key,
      validator: validator
    })
    return self
  }

  self.optional = function(key, defaultValue, validator) {
    if(!key) throw new Error('key must be provided')

    optionalArgs.push({ 
      key: key,
      defaultValue: defaultValue,
      validator: validator 
    })
    return self
  }

  return self
}

var functionArg = function(arg) {
  if(typeof arg !== 'function') return 'argument must be function'
  return null
}

module.exports = {
  defineParam: defineParam,
  functionArg: functionArg
}
