'use strict';

const { makeExecutableSchema } = require('graphql-tools');
const { makeGraphqlHandler } = require('./make-graphql-handler');

const schema = makeExecutableSchema({
  typeDefs: [
    `
      type Query {
        hello: String
        bye: String
      }
    `
  ],
  resolvers: {
    Query: {
      hello: (root, args, context) => context.Hello.sayHi(),
      bye: (root, args, context) => context.Hello.sayBye(),
    }
  }
})


const graphqlContext = {
  Hello: {
    sayHi: () => 'hello world',
    sayBye: () => {
      throw new Error('Bye')
    }
  }
};

const graphqlHandler = makeGraphqlHandler({ schema, graphqlContext });

describe('makeGraphqlHandler', () => {
  describe('when a valid query is sent', () => {
    const callback = jest.fn();
    beforeAll(() => {
      const event = {
        body: JSON.stringify({
          query: `{ hello }`,
          variables: {}
        })
      };
      return graphqlHandler({ event, callback })
    });

    it('should send a response to the query', () => {

      expect(callback.mock.calls[0][0]).toEqual(null);
      expect(callback.mock.calls[0][1].statusCode).toEqual(200);
      expect(callback.mock.calls[0][1].body).toEqual(
        JSON.stringify({
          data: {
            hello: 'hello world'
          }
        })
      );
    });

    it('should attach CORS header', () => {
      expect(callback.mock.calls[0][1].headers).toEqual({
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'OPTIONS,POST',
        'Access-Control-Allow-Origin': '*',
      });
    });
  });

  describe('when an error is throw in the graphql context', () => {
    const callback = jest.fn();

    beforeAll(() => {
      const event = {
        body: JSON.stringify({
          query: `{ bye }`,
          variables: {}
        })
      };
      return graphqlHandler({ event, callback })
    });

    it('should send a response to the query with statusCode 400', () => {
      expect(callback.mock.calls[0][0]).toEqual(null);
      expect(callback.mock.calls[0][1].statusCode).toEqual(400);

      const body = JSON.parse(callback.mock.calls[0][1].body);
      expect(body.data).toEqual({
        bye: null
      });
      expect(body.errors).toHaveLength(1);
    });
  });
});