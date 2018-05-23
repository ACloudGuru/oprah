'use strict'

const get = require('lodash.get');
const { SchemaDirectiveVisitor } = require('graphql-tools');
const {
  GraphQLList,
  GraphQLDirective,
  GraphQLEnumType,
  GraphQLBoolean,
  DirectiveLocation,
  defaultFieldResolver
} = require('graphql');

// Examples:

// SERVER
// viewer: {
//   server: true
// }

// ADMIN
// viewer: {
//   id: 'google|80dffa9b5ff74089071'
//   roles: {
//     admin: true
//   }
// }

// ORGANISATION_ADMIN
// viewer: {
//   id: 'google|80dffa9b5ff74089071'
//   organisationId: '1b3a3e70feb87753204',
//   roles: {
//     organisationAdmin_1b3a3e70feb87753204: true
//   }
// }

// VIEWER
// viewer: {
//   id: 'google|80dffa9b5ff74089071'
// }

const generateEnum = enumValues => enumValues.reduce(
  (acc, value) => Object.assign(
    acc,
    {
      [value]: {
        description: value
      }
    }
  ), {});

const RoleType = new GraphQLEnumType({
  name: 'Role',
  values: generateEnum(['SERVER', 'ADMIN', 'ORGANISATION_ADMIN', 'VIEWER'])
});

class AuthDirective extends SchemaDirectiveVisitor {
  static getDirectiveDeclaration(directiveName, schema) {
    const previousDirective = schema.getDirective(directiveName);

    if (previousDirective) {
      throw new Error(`Duplicate declaration of directive: ${directiveName} has been found`);
    }

    return new GraphQLDirective({
      name: directiveName,
      locations: [
        DirectiveLocation.FIELD_DEFINITION
      ],
      args: {
        roles: {
          type: new GraphQLList(RoleType)
        },
        throwError: {
          type: GraphQLBoolean
        }
      }
    });
  }

  visitFieldDefinition(field) {
    const roles = get(this, 'args.roles') || [];
    const throwError = get(this, 'args.throwError') || false;
    const resolve = get(field, 'resolve') || defaultFieldResolver;
    field.description = `restricted to: [${roles}]`
    field.resolve = (...resolveArgs) => {
      // resolveArgs [root, args, context, info]
      const context = get(resolveArgs, '2') || {};
      const viewer = get(context, 'viewer') || {};

      const hasPermission = roles.includes('SERVER') && isServer(viewer)
      || roles.includes('ADMIN') && isAdmin(viewer)
      || roles.includes('ORGANISATION_ADMIN') && isOrganisationAdmin(viewer)
      || roles.includes('VIEWER') && isViewer(viewer);

      if (hasPermission) {
        return resolve.apply(this, resolveArgs);
      }

      if (throwError) {
        throw new Error(`This field requires ${JSON.stringify(roles)} access`);
      }

      return null;
    };
  }
}

const isServer = viewer => !!get(viewer, 'server');
const isAdmin = viewer => !!get(viewer, 'roles.admin');
const isOrganisationAdmin = viewer => {
  const roles = get(viewer, 'roles') || {};
  const organisationId = get(viewer, 'organisationId');

  return !!roles[`organisationAdmin_${organisationId}`];
};
const isViewer = viewer => !!get(viewer, 'id');

module.exports = AuthDirective;
