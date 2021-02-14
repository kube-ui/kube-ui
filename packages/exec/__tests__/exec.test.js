"use strict";

const { exec, StubExec } = require("..");
const expect = require("chai").expect;

describe("exec", () => {
  it("should execute a command and parse the output", async () => {
    const cmd = "test-command";
    const output = '{"output":"test"}';

    StubExec.stdout(cmd, output);

    const testResult = await exec("test-command");
    expect(testResult).to.deep.equal({ output: "test" });
    expect(StubExec.verify(cmd).times).to.equal(1);
  });

  it("should execute a command and skip parsing", async () => {
    const cmd = "test-command";
    const output = "test";

    StubExec.stdout(cmd, output);

    const testResult = await exec("test-command", { skipParsing: true });
    expect(testResult).to.deep.equal("test");
    expect(StubExec.verify(cmd).times).to.equal(1);
  });

  it("should execute a command and catch stderr errors", async () => {
    const cmd = "test-command";
    const output = "the command has failed";

    StubExec.stderr(cmd, output);

    try {
      await exec("test-command");
    } catch (e) {
      expect(e).to.deep.equal({
        name: "CommandError",
        message: "stderr: the command has failed",
      });
      expect(StubExec.verify(cmd).times).to.equal(1);
    }
  });

  it("should execute a command and recover from parsing error", async () => {
    const cmd = "test-command";
    const output = "test";

    StubExec.stdout(cmd, output);

    try {
      await exec("test-command");
    } catch (e) {
      expect(e).to.deep.equal({
        name: "ParsingError",
        message: "SyntaxError: Unexpected token e in JSON at position 1",
      });
      expect(StubExec.verify(cmd).times).to.equal(1);
    }
  });

  it("should execute a command and recover from error", async () => {
    const cmd = "test-command";
    const output = new Error("the command has failed");

    StubExec.error(cmd, output);

    try {
      await exec("test-command");
    } catch (e) {
      expect(e).to.deep.equal({
        name: "ExecutionError",
        message: "Error: the command has failed",
      });
      expect(StubExec.verify(cmd).times).to.equal(1);
    }
  });
});
