'use strict';

const merge = require('lodash.merge');
const omit = require('lodash.omit');
const get = require('lodash.get');

const asAdmin = ({ context }) => {
  return merge(
    {},
    context,
    {
      viewer: {
        id: get(context, 'viewer.id') || 'admin-user-id',
        roles: {
          admin: true
        }
      }
    }
  );
};

const asServer = ({ context }) => {
  return merge(
    {},
    context,
    {
      viewer: {
        server: true
      }
    }
  );
};

const asOrgAdmin = ({ context, orgId }) => {
  const filteredContext = omit(context, ['viewer']);

  return Object.assign(
    {},
    filteredContext,
    {
      viewer: {
        id: get(context, 'viewer.id') || 'org-admin-user-id',
        organisationId: orgId,
        roles: {
          [`organisationAdmin_${orgId}`]: true
        }
      }
    }
  );
};

const asOrgUser = ({ context, orgId }) => {
  const filteredContext = omit(context, ['viewer']);

  return Object.assign(
    {},
    filteredContext,
    {
      viewer: {
        id: get(context, 'viewer.id') || 'org-user-id',
        organisationId: orgId
      }
    }
  );
};

module.exports = {
  testUtils: {
    asAdmin,
    asServer,
    asOrgAdmin,
    asOrgUser
  }
};
