const padVersionNumber = toPad => (new Array(20).join('0') + toPad).slice(-20);

const generateNextVersionNumber = ({ currentVersionNumber }) => {
  if (!currentVersionNumber) {
    return padVersionNumber('1');
  }

  const nextVersionNumber = parseInt(currentVersionNumber, 10) + 1;

  if (Number.isNaN(nextVersionNumber)) {
    throw new Error(
      `Cannot generate next version number for '${currentVersionNumber}'. Current version number must be number.`
    );
  }

  return padVersionNumber(nextVersionNumber);
};

module.exports = { generateNextVersionNumber };
