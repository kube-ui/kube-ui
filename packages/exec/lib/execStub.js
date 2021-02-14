"use strict";

const cp = require("child_process");

const commands = {};

const execFileStub = (callback, error, stdout, stderr) => {
  setTimeout(function () {
    callback(error, stdout, stderr);
  }, 0);
};

cp.execFile = (command, options, callback) => {
  const mock = commands[command];
  
  if (mock) {
    const { error, stdout, stderr } = mock;
    commands[command] = {
      ...mock,
      times: mock.times + 1
    }
    return execFileStub(callback, error, stdout, stderr);
  } else {
    throw `No stubs matching ${command}...`;
  }
};

const stub = (command, error, stdout, stderr) => {
  commands[command] = {
    error,
    stdout,
    stderr,
    times: 0
  };
};

class StubExec {
  static stdout(command, stdout) {
    stub(command, null, stdout, null);
  }

  static stderr(command, stderr) {
    stub(command, null, null, stderr);
  }

  static error(command, error) {
    stub(command, error, null, null);
  }

  static verify(command) {
    const mock = commands[command];
    
    if(!mock) {
      throw `No stubs matching ${command}...`;
    }

    return mock;
  }
}

module.exports = {
  StubExec
};
