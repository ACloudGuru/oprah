const makeRun = ({ init, configure, cleanUp }) => (
  { deleting } = { deleting: false }
) =>
  init()
    .then(configure)
    .then(() => deleting && cleanUp());

module.exports = { makeRun };
