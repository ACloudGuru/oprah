'use strict';

const { testUtils } = require('./test-utils');

describe('#testUtils', () => {
  describe('asAdmin', () => {
    it('should fake the context as if it were an ACG admin viewer request', () => {
      const context = {
        viewer: {
          roles: {
            member: true
          }
        }
      };

      const result = testUtils.asAdmin({ context });

      expect(result.viewer.roles.admin).toEqual(true);
      expect(result.viewer.id).toEqual('admin-user-id');
    });

    it('should respect the viewer id, if defined', () => {
      const context = {
        viewer: {
          id: 'some-regular-user-id',
          roles: {
            member: true
          }
        }
      };

      const result = testUtils.asAdmin({ context });

      expect(result.viewer.id).toEqual('some-regular-user-id');
    });
  });

  describe('asServer', () => {
    it('should fake the context as it were a server request', () => {
      const context = {};

      const result = testUtils.asServer({ context });

      expect(result.viewer.server).toEqual(true);
    });
  });

  describe('asOrgAdmin', () => {
    it('should fake the context as if it were an org admin viewer request', () => {
      const context = {
        viewer: {
          roles: {
            member: true
          }
        }
      };

      const result = testUtils.asOrgAdmin({ context, orgId: '1337' });

      expect(result.viewer.id).toEqual('org-admin-user-id');
      expect(result.viewer.organisationId).toEqual('1337');
      expect(result.viewer.roles.organisationAdmin_1337).toEqual(true);
    });

    it('should respect the viewer id, if defined', () => {
      const context = {
        viewer: {
          id: 'some-regular-user-id',
          roles: {
            member: true
          }
        }
      };

      const result = testUtils.asOrgAdmin({ context, orgId: '7331' });

      expect(result.viewer.id).toEqual('some-regular-user-id');
      expect(result.viewer.organisationId).toEqual('7331');
      expect(result.viewer.roles.organisationAdmin_7331).toEqual(true);
    });
  });

  describe('asOrgUser', () => {
    it('should fake the context as if it were an org user viewer request', () => {
      const context = {
        viewer: {
          roles: {
            member: true
          }
        }
      };

      const result = testUtils.asOrgUser({ context, orgId: '87654326543' });

      expect(result.viewer.id).toEqual('org-user-id');
      expect(result.viewer.organisationId).toEqual('87654326543');
      expect(result.viewer.roles).toBeUndefined();
    });

    it('should respect the viewer id, if defined', () => {
      const context = {
        viewer: {
          id: 'some-regular-user-id',
          roles: {
            member: true
          }
        }
      };

      const result = testUtils.asOrgUser({ context, orgId: '87654326543' });

      expect(result.viewer.id).toEqual('some-regular-user-id');
      expect(result.viewer.organisationId).toEqual('87654326543');
      expect(result.viewer.roles).toBeUndefined();
    });
  });
});
