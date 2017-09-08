/*
Enums of available Regina services
*/

var CRUD = require('./CRUD')


exports.aggregate = {
  toString: 'aggregate',
  toCRUD: CRUD.MULTI
};

exports.insert = {
  toString: 'insert',
  toCRUD: CRUD.CREATE
};

exports.find = {
  toString: 'find',
  toCRUD: CRUD.READ
};

exports.count = {
  toString: 'count',
  toCRUD: CRUD.READ
};

exports.update = {
  toString: 'update',
  toCRUD: CRUD.UPDATE
};

exports.remove = {
  toString: 'remove',
  toCRUD: CRUD.DELETE
};
