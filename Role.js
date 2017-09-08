/*
Enums of available Regina services
*/

var Type = require('./Type')

exports.coll = {
  toString: 'coll',
  type: [Type.str]
};

exports.docs = {
  toString: 'docs',
  type: [Type.obj, Type.arr]
};

exports.q = {
  toString: 'q',
  type: [Type.obj]
};

exports.u = {
  toString: 'u',
  type: [Type.obj]
};

exports.p = {
  toString: 'p',
  type: [Type.arr]
};

exports.opt = {
  toString: 'opt',
  type: [Type.optobj]
};

exports.meta = {
  toString: 'meta',
  type: [Type.optobj]
};

exports.ack = {
  toString: 'ack',
  type: [Type.fun]
};
