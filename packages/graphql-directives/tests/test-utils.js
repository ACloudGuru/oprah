'use strict'

module.exports = {
  generateServerViewer: () => {
    return {
      server: true
    }
  },
  generateAdminViewer: () => {
    return {
      id: 'admin123',
      roles: {
        admin: true
      }
    };
  },
  generateOrganisationAdminViewer: () => {
    return {
      id: 'validOrgAdmin',
      organisationId: 'org123',
      roles: {
        organisationAdmin_org123: true
      }
    }
  },
  generateInvalidOrganisationAdminViewer: () => {
    return {
      id: 'invalidOrgAdmin',
      organisationId: 'org123',
      roles: {
        organisationAdmin_invalidOrgId123: true
      }
    }
  },
  generateViewer: () => {
    return {
      id: 'validViewer'
    }
  }
}
