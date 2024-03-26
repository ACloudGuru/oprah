const deepMap = (obj, fn) => {
  if (Array.isArray(obj)) {
    return obj.map(value => deepMap(value, fn));
  }

  if (typeof obj === 'object' && obj !== null) {
    return Object.keys(obj).reduce((acc, key) => {
      acc[key] = deepMap(obj[key], fn);
      return acc;
    }, {});
  }

  return fn(obj);
};

module.exports = {
  deepMap
};
