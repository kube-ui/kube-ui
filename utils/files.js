const fs = require('fs');

const parseDataFile = (filePath, defaults) => {
  try {
    return JSON.parse(fs.readFileSync(filePath));
  } catch (err) {
    console.error(err)
    return defaults;
  }
};

module.exports = {
  parseDataFile,
};
