let getSettingsPromise = null;
const makeMemoizedGetSettings =
({ getSettings }) =>
  () => {
    if (!getSettingsPromise) {
      getSettingsPromise = getSettings();
    }

    return getSettingsPromise;
  };

module.exports = {
  makeMemoizedGetSettings
};
