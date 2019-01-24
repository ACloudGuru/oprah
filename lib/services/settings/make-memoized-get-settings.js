const makeMemoizedGetSettings =
({ getSettings }) => {
  let getSettingsPromise = null;
  return () => {
    if (!getSettingsPromise) {
      getSettingsPromise = getSettings();
    }

    return getSettingsPromise;
  };
}


module.exports = {
  makeMemoizedGetSettings
};
