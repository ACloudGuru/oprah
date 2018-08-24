'use strict';

const AuthDirective = require('../../directives/auth');
const { graphql } = require('graphql');
const { makeExecutableSchema } = require('graphql-tools');
const testUtils = require('../test-utils');

const schema = makeExecutableSchema({
  typeDefs: [
    `
      type Query {
        hello: String @auth(roles: [INSTRUCTOR])
      }
    `
  ],
  resolvers: {
    Query: {
      hello: () => 'world'
    }
  },
  schemaDirectives: {
    auth: AuthDirective
  }
});

describe('auth directive - INSTRUCTOR', () => {
  const query = `
    query {
      hello
    }
  `;

  it('should only allow INSTRUCTORs to run the resolver', () => {
    return graphql(schema, query, null, { viewer: testUtils.generateInstructorViewer() })
    .then(res => {
      expect(res.data.hello).toEqual('world');
    });
  });

  it('should not resolve the value for non INSTRUCTORs', () => {
    return graphql(schema, query, null, { viewer: testUtils.generateViewer() })
    .then(res => {
      expect(res.data.hello).toEqual(null);
    });
  });
});
