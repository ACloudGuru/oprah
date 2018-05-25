'use strict';

import { GraphQLScalarType } from 'graphql';
import { toISOString } from './utils';

const typeDefs = `
    scalar ISODate
`;

const resolvers = {
    ISODate: new GraphQLScalarType({
        name: 'ISODate',
        description: 'Consumes compatible dates and converts to ISOString Date custom scalar type',
        parseValue: toISOString,
        serialize: toISOString,
        parseLiteral: toISOString,
    }),
};

module.exports = {
    resolvers,
    typeDefs
};

