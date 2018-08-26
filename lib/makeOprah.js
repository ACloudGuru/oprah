'use strict';

const run = () => {

};

const makeOprah = ({ params }) => {
  console.log(params);
  return { run };
};

module.exports = { makeOprah };
