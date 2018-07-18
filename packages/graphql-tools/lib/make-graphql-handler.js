'use strict';

const { graphql } = require('graphql');
const get = require('lodash.get');

const CORS_HEADERS = {
  'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
  'Access-Control-Allow-Methods': 'OPTIONS,POST',
  'Access-Control-Allow-Origin': '*',
};

const parseJSON = obj => {
  if (!obj) {
    return {};
  }

  try {
    return JSON.parse(obj);
  } catch (e) {
    return {};
  }
};

const makeGraphqlHandler =
({ schema, graphqlContext }) =>
({ event, callback }) => {

  const body = parseJSON(event.body);
  return graphql(
    schema,
    get(body, 'query'),
    null,
    graphqlContext,
    get(body, 'variables')
  )
  .then(res => {
    const errors = get(res, 'errors') || [];
    const hasErrors = errors.length;
    if (hasErrors) {
      console.error(JSON.stringify({ errors: res.errors, viewer: graphqlContext.viewer }, null, 2))
    }

    const response = {
      statusCode: hasErrors ? 400 : 200,
      headers: CORS_HEADERS,
      body: JSON.stringify(res)
    };

    if (!callback) {
      return response;
    }

    callback(null, response);
  })
  .catch(err => {
    console.error(err.stack);

    const response = {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ message: 'Unexpected error' })
    };

    if (!callback) {
      return response;
    }

    callback(null, response);
  });
};

module.exports = { makeGraphqlHandler };

