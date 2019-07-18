const getRegion = () => {
  const region = process.env.AWS_DEFAULT_REGION;

  if (!region) {
    return Promise.reject(
      new Error(
        "Could not determine region. Set env variable `AWS_DEFAULT_REGION`"
      )
    );
  }

  return Promise.resolve(region);
};

module.exports = {
  getRegion
};
