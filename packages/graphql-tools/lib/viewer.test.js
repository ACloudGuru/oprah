'use strict';

const { getViewerFromEvent, encodeViewer } = require('../index');

describe('#encodeViewer', () => {
  it('should base 64 encode viewer', () => {
    const viewer = {
      roles: { admin: true },
      organisationId: 123
    };

    const encodedViewer = encodeViewer(viewer);

    expect(encodedViewer).toEqual('eyJyb2xlcyI6eyJhZG1pbiI6dHJ1ZX0sIm9yZ2FuaXNhdGlvbklkIjoxMjN9');
  });

  it('should return empty string if viewer is invalid', () => {
    const viewer = 'invalid viewer';

    const encodedViewer = encodeViewer(viewer);

    expect(encodedViewer).toEqual('');
  });

  it('should return empty string if viewer is null', () => {
    const viewer = null;
    const encodedViewer = encodeViewer(viewer);

    expect(encodedViewer).toEqual('');
  });
});

describe('#getViewerFromEvent', () => {
  it('should get viewer from lambda event', () => {
    const viewer = 'eyJyb2xlcyI6eyJhZG1pbiI6dHJ1ZX0sIm9yZ2FuaXNhdGlvbklkIjoxMjN9';

    const event = { headers: { viewer }};

    const decodedViewer = getViewerFromEvent({ event });

    expect(decodedViewer).toEqual({
      roles: { admin: true },
      organisationId: 123
    });
  });

  it('should return empty object if decoding fails', () => {
    const viewer = '';
    const event = { headers: { viewer }};

    const decodedViewer = getViewerFromEvent({ event });

    expect(decodedViewer).toEqual({});
  });

  it('should return empty object if viewer does not exist', () => {
    const event = { headers: { }};

    const decodedViewer = getViewerFromEvent({ event });

    expect(decodedViewer).toEqual({});
  });
});
