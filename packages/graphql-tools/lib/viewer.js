'use strict';

const get = require('lodash.get');
const isPlainObject = require('lodash.isplainobject');

const decodeViewer = viewerString => {
  try {
    const jsonString = Buffer.from(viewerString, 'base64').toString();
    return JSON.parse(jsonString);
  } catch (e) {
    return {};
  }
};

const encodeViewer = viewerObj => {
  try {
    if (!isPlainObject(viewerObj) || !viewerObj) {
      return '';
    }

    return Buffer.from(JSON.stringify(viewerObj)).toString('base64');
  } catch (e) {
    return '';
  }
};

const getViewerFromEvent = ({ event }) => {
  const viewerString = get(event, 'headers.viewer') || '';

  return decodeViewer(viewerString);
};

module.exports = { getViewerFromEvent, encodeViewer };

