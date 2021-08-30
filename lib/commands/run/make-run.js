const makeRun = ({ init, configure, cleanUp }) => (
  { removing } = { removing: false }
) =>
  init()
    .then(configure)
    .then(() => removing && cleanUp());

module.exports = { makeRun };
