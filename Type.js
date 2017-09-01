/*
Enums of available Regina supported types for the requests parameters
Each type has its optional version
*/

//ex : {}
exports.obj = {
  valid : function(arg){
    return arg != null && typeof arg === 'object' && !Array.isArray(arg)
  },
  toString : 'object'
};

//ex : {} or null
exports.optobj = {
  valid : function(arg){
    return arg == null ||( typeof arg === 'object' && !Array.isArray(arg) )
  },
  toString : 'object?'
};

//ex : toString()
exports.fun = {
  valid : function(arg){return arg != null && typeof arg === 'function'},
  toString : 'function'
};

//ex : toString() or null
exports.optfun = {
  valid : function(arg){return arg == null || typeof arg === 'function'},
  toString : 'function?'
};

//ex : []
exports.arr = {
  valid : function(arg){return arg != null && Array.isArray(arg)},
  toString : 'array'
};

//ex : [] or null
exports.optarr = {
  valid : function(arg){return arg == null || Array.isArray(arg)},
  toString : 'array?'
};

//ex : 'Regina'
exports.str = {
  valid : function(arg){return arg != null && typeof arg === 'string'},
  toString : 'string'
};

//ex : 'Regina' or null
exports.optstr = {
  valid : function(arg){return arg == null || typeof arg === 'string'},
  toString : 'string?'
};
