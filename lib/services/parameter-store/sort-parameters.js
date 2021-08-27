const sortParameters = parameters =>
  Object.keys(parameters)
    .sort()
    .reduce((acc, key) => {
      console.log('key', key);
      acc[key] = parameters[key];
      return acc;
    }, {});

module.exports = {
  sortParameters
};
