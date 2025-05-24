const { describe, test, expect } = require("@jest/globals");

describe("sanity test", () => {
  test("jest should be installed properly", () => {
    expect(1 + 1).toStrictEqual(2);
  });
});
