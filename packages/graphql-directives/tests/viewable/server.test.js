'use strict';

const ViewableDirective = require('../../directives/viewable');
const { graphql } = require('graphql');
const { makeExecutableSchema } = require('graphql-tools');
const testUtils = require('../test-utils');

const schema = makeExecutableSchema({
  typeDefs: [
    `
      type Query {
        hello: String @viewable(roles: ["SERVER"])
      }

      directive @viewable(roles: [String]) on FIELD_DEFINITION
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

describe('viewable directive - SERVER', () => {
  const query = `
    query {
      hello
    }
  `;

  it('should only allow SERVER to run the resolver', () => {
    return graphql(schema, query, null, { viewer: testUtils.generateServerViewer() })
    .then(res => {
      expect(res.data.hello).toEqual('world');
    });
  });

  it('should not resolve the value for non SERVER', () => {
    return graphql(schema, query, null, { viewer: testUtils.generateViewer() })
    .then(res => {
      expect(res.data.hello).toEqual(null);
    });
  });
});
