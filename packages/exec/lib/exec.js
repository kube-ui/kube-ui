"use strict";

const { exec } = require("child_process");
const { StubExec } = require("./execStub");

const execPromise = (command, userOptions) => {
  const options = {
    skipParsing: false,
    ...userOptions
  }
  return new Promise(function (resolve, reject) {
    exec(command, { maxBuffer: 1024 * 5000 }, (error, stdout, stderr) => {
      if (error) {
        reject({
          name: 'ExecutionError',
          message: `${error.name}: ${error.message}`
        });
      }

      if (stderr) {
        reject({
          name: "CommandError",
          message: `stderr: ${stderr}`,
        });
      }

      if (options.skipParsing) {
        resolve(stdout);
      } else {
        try {
          const result = JSON.parse(stdout);
          resolve(result);
        } catch(error) {
          reject({
            name: 'ParsingError',
            message: `${error.name}: ${error.message}`
          });
        }
      }
    });
  });
};

module.exports = {
  exec: execPromise,
  StubExec
};
