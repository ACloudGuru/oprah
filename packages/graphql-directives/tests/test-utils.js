'use strict';

module.exports = {
  generateBffViewer: () => ({ bff: true }),
  generateServerViewer: () => ({ server: true }),
  generateAdminViewer: () => ({
    id: 'admin123',
    roles: {
      admin: true
    }
  }),
  generateEditorViewer: () => ({
    id: 'editor123',
    roles: {
      editor: true
    }
  }),
  generateInstructorViewer: () => ({
    id: 'instructor123',
    roles: {
      instructor: true
    }
  }),
  generateOrganisationAdminViewer: () => ({
    id: 'validOrgAdmin',
    organisationId: 'org123',
    roles: {
      organisationAdmin_org123: true
    }
  }),
  generateInvalidOrganisationAdminViewer: () => ({
    id: 'invalidOrgAdmin',
    organisationId: 'org123',
    roles: {
      organisationAdmin_invalidOrgId123: true
    }
  }),
  generateViewer: () => ({ id: 'validViewer' })
};
