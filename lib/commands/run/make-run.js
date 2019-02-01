const makeRun = ({ init, configure }) => () => init().then(configure);

module.exports = { makeRun };
