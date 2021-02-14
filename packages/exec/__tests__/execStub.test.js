"use strict";

const { exec, StubExec } = require("..");
const expect = require("chai").expect;

describe("StubExec", () => {
  it("should stub exec once", async () => {
    const cmd = "test-command";
    const output = '{"output":"test"}';

    StubExec.stdout(cmd, output);

    const testResult = await exec("test-command");
    expect(testResult).to.deep.equal({ output: "test" });

    expect(StubExec.verify(cmd).times).to.equal(1);
  });
  
  it("should stub exec twice", async () => {
    const cmd = "test-command";
    const output = '{"output":"test"}';

    StubExec.stdout(cmd, output);

    const testResult1 = await exec("test-command");
    expect(testResult1).to.deep.equal({ output: "test" });

    const testResult2 = await exec("test-command");
    expect(testResult2).to.deep.equal({ output: "test" });

    expect(StubExec.verify(cmd).times).to.equal(2);
  });

  it("should trow an exception when receiving unknown commands", async () => {
    const cmd = "test-command";
    const output = '{"output":"test"}';

    StubExec.stdout(cmd, output);

    try {
      const testResult = await exec("unstubbed-command");
    } catch (error) {
      expect(error).to.equal("No stubs matching unstubbed-command...");
      expect(StubExec.verify(cmd).times).to.equal(0);
    }
  });

  it("should trow an exception when verifying unknown commands", async () => {
    try {
        StubExec.verify("unstubbed-command").times
    } catch (error) {
      expect(error).to.equal("No stubs matching unstubbed-command...");
    }
  });
});
