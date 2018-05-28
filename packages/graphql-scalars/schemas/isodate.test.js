'use strict';

const { makeExecutableSchema } = require('graphql-tools');
const { graphql } = require('graphql');
const { isodate } = require('../index');
const merge = require('lodash.merge');

const schema = makeExecutableSchema({
  typeDefs: [
    `
      type Query {
        createdDate: ISODate
        updatedDate: ISODate
      }
    ` + isodate.typeDef
  ],
  resolvers: merge({
    Query: {
      createdDate: () => '10-12-2018',
      updatedDate: () => '10-12-2018'
    }
  }, isodate.resolver)
});

it('should return ISODate string', () => {
  const query = `
    query {
      createdDate
      updatedDate
    }
  `;

  return graphql(schema, query, null).then(res => {
    expect(res.data.updatedDate).toEqual('2018-10-11T13:00:00.000Z');
    expect(res.data.createdDate).toEqual('2018-10-11T13:00:00.000Z');
  });
});
