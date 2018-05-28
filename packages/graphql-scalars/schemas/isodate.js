'use strict';

const { GraphQLScalarType } = require('graphql');
const { toISOString } = require('../utils');

const typeDef = `
    scalar ISODate
`;

const resolver = {
  ISODate: new GraphQLScalarType({
      name: 'ISODate',
      description: 'Consumes compatible dates and converts to and from ISOString Date custom scalar type',
      parseValue: toISOString,
      serialize: toISOString,
      parseLiteral: toISOString,
  })
};

module.exports = {
    resolver,
    typeDef
};

