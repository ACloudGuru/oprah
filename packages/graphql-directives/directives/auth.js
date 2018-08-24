'use strict';

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

// BFF
// viewer: {
//   bff: true
// }

// ADMIN
// viewer: {
//   id: 'google|80dffa9b5ff74089071'
//   roles: {
//     admin: true
//   }
// }

// INSTRUCTOR
// viewer: {
//   id: 'google|80dffa9b5ff74089071'
//   roles: {
//     instructor: true
//   }
// }

// EDITOR
// viewer: {
//   id: 'google|80dffa9b5ff74089071'
//   roles: {
//     editor: true
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
  values: generateEnum(['SERVER', 'ADMIN', 'ORGANISATION_ADMIN', 'VIEWER', 'BFF', 'EDITOR', 'INSTRUCTOR'])
});

const isServer = viewer => get(viewer, 'server') === true;
const isBff = viewer => get(viewer, 'bff') === true;
const isAdmin = viewer => get(viewer, 'roles.admin') === true;
const isEditor = viewer => get(viewer, 'roles.editor') === true;
const isInstructor = viewer => get(viewer, 'roles.instructor') === true;
const isViewer = viewer => !!get(viewer, 'id');
const isOrganisationAdmin = viewer => {
  const roles = get(viewer, 'roles') || {};
  const organisationId = get(viewer, 'organisationId');

  return roles[`organisationAdmin_${organisationId}`] === true;
};

const hasPermission = (roles, viewer) => {
  return roles.includes('SERVER') && isServer(viewer) ||
        roles.includes('ADMIN') && isAdmin(viewer) ||
        roles.includes('EDITOR') && isEditor(viewer) ||
        roles.includes('INSTRUCTOR') && isInstructor(viewer) ||
        roles.includes('ORGANISATION_ADMIN') && isOrganisationAdmin(viewer) ||
        roles.includes('VIEWER') && isViewer(viewer) ||
        roles.includes('BFF') && isBff(viewer);
};

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
    field.description = `restricted to: [${roles}]`;
    field.resolve = (...resolveArgs) => {
      // resolveArgs [root, args, context, info]
      const context = get(resolveArgs, '2') || {};
      const viewer = get(context, 'viewer') || {};

      if (hasPermission(roles, viewer)) {
        return resolve.apply(this, resolveArgs);
      }

      if (throwError) {
        throw new Error(`This field requires ${JSON.stringify(roles)} access`);
      }

      return null;
    };
  }
}


module.exports = AuthDirective;
