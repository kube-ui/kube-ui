# `exec`

Wrap cli command execution in a Javascript promise.

## Usage

Default usage:
```
const { exec } = require('exec');

const result = await exec("test-command");
```

With options:
```
const { exec } = require('exec');

const options = {
    skipParsing: false // Parse command stdout, default set to false
}

const result = await exec("test-command", options);
```
## Tests

Running tests with `Mocha` and `Chai`.

Testing `stdout`:
```
const expect = require("chai").expect;
const { exec, StubExec } = require('exec');

StubExec.stdout('test-command', '{"output":"test"}');

const testResult = await exec('test-command');

expect(testResult).to.deep.equal({ output: 'test' });
expect(StubExec.verify(cmd).times).to.equal(1);
```

Testing `stderr`:
```
const expect = require("chai").expect;
const { exec, StubExec } = require('exec');

StubExec.stderr('test-command', 'the command has failed');

try {
    await exec("test-command");
} catch (e) {
    expect(e).to.deep.equal({
        name: "CommandError",
        message: "stderr: the command has failed",
    });

    expect(StubExec.verify(cmd).times).to.equal(1);
}
```

Testing `error`:
```
const expect = require("chai").expect;
const { exec, StubExec } = require('exec');

StubExec.error("test-command", new Error("the command has failed"));

try {
    await exec("test-command");
} catch (e) {
    expect(e).to.deep.equal({
        name: "ExecutionError",
        message: "Error: the command has failed",
    });

    expect(StubExec.verify(cmd).times).to.equal(1);
}
```
