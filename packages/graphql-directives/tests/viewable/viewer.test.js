'use strict';

const ViewableDirective = require('../../directives/viewable');
const { graphql } = require('graphql');
const { makeExecutableSchema } = require('graphql-tools');
const testUtils = require('../test-utils');

const schema = makeExecutableSchema({
  typeDefs: [
    `
      type Query {
        hello: String @viewable(roles: [VIEWER])
      }
    `
  ],
  resolvers: {
    Query: {
      hello: () => 'world'
    }
  },
  schemaDirectives: {
    viewable: ViewableDirective
  }
});

describe('viewable directive - VIEWER', () => {
  const query = `
    query {
      hello
    }
  `;

  it('should only allow VIEWER to run the resolver', () => {
    return graphql(schema, query, null, { viewer: testUtils.generateViewer() })
    .then(res => {
      expect(res.data.hello).toEqual('world');
    });
  });

  it('should not resolve the value for non VIEWER', () => {
    return graphql(schema, query, null, { viewer: {} })
    .then(res => {
      expect(res.data.hello).toEqual(null);
    });
  });
});
