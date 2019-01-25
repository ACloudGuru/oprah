const sortParameters = parameters => Object.keys(parameters)
.sort()
.reduce((acc, key) => {
  acc[key] = parameters[key];
  return acc;
}, {});

module.exports = {
  sortParameters
};
