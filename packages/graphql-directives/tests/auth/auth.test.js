'use strict';

const AuthDirective = require('../../directives/auth');
const { graphql } = require('graphql');
const { makeExecutableSchema } = require('graphql-tools');
const testUtils = require('../test-utils');

const schema = makeExecutableSchema({
  typeDefs: [
    `
      type Query {
        hello: String @auth(roles: [ADMIN, SERVER] throwError: true)
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

describe('auth directive', () => {

  describe(' ability to throw errors when required', () => {
    const query = `
      query {
        hello
      }
    `;

    describe('when the viewer is an ADMIN', () => {
      it('should support multiple roles and should resolve the value', () => {
        return graphql(schema, query, null, { viewer: testUtils.generateAdminViewer() })
        .then(res => expect(res.data.hello).toEqual('world'));
      });
    });

    describe('when the viewer is a SERVER', () => {
      it('should support multiple roles and should resolve the value', () => {
        return graphql(schema, query, null, { viewer: testUtils.generateServerViewer() })
        .then(res => expect(res.data.hello).toEqual('world'));
      });
    });

    describe('when viewer does not have access to the field', () => {
      it('should throw an error if requested', () => {
        return graphql(schema, query, null, { viewer: testUtils.generateOrganisationAdminViewer() })
        .then(res => {
          expect(res.errors[0].message).toEqual('This field requires ["ADMIN","SERVER"] access')
        });
      });
    });
  });
});
