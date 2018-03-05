'use strict';

module.exports = ({ file, options, env }) => {
  return {
    plugins: {
      'postcss-easy-import': { prefix: '_' },
      cssnano: true,
    },
  };
};
