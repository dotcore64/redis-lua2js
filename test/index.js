import { join } from "node:path";
import { readFileSync } from "node:fs";
import { expect } from "chai";
import { requireFromString, importFromStringSync } from "module-from-string";

// https://github.com/import-js/eslint-plugin-import/issues/1649
// eslint-disable-next-line import/no-unresolved
import lua2js from "redis-lua2js";

describe("redis-lua2js", () => {
  it("should export name and numberOfKeys from lua", () => {
    const lua = readFileSync(
      // eslint-disable-next-line n/no-unsupported-features/node-builtins
      join(import.meta.dirname, "test_both.lua"),
      "utf8",
    );

    expect(requireFromString(lua2js(lua))).to.deep.equal({
      name: "pdel",
      numberOfKeys: 1,
      lua,
    });
  });

  it("should return null name and numeberOfKeys", () => {
    const lua = readFileSync(
      // eslint-disable-next-line n/no-unsupported-features/node-builtins
      join(import.meta.dirname, "test_none.lua"),
      "utf8",
    );

    expect(requireFromString(lua2js(lua))).to.deep.equal({
      name: null,
      numberOfKeys: null,
      lua,
    });
  });

  it("should export name from lua and null numberOfKeys", () => {
    const lua = readFileSync(
      // eslint-disable-next-line n/no-unsupported-features/node-builtins
      join(import.meta.dirname, "test_name.lua"),
      "utf8",
    );

    expect(requireFromString(lua2js(lua))).to.deep.equal({
      name: "pdel",
      numberOfKeys: null,
      lua,
    });
  });

  it("should export null name and numberOfKeys from lua", () => {
    const lua = readFileSync(
      // eslint-disable-next-line n/no-unsupported-features/node-builtins
      join(import.meta.dirname, "test_nkeys.lua"),
      "utf8",
    );

    expect(requireFromString(lua2js(lua))).to.deep.equal({
      name: null,
      numberOfKeys: 1,
      lua,
    });
  });

  it("should generate esm module", () => {
    const lua = readFileSync(
      // eslint-disable-next-line n/no-unsupported-features/node-builtins
      join(import.meta.dirname, "test_both.lua"),
      "utf8",
    );

    expect(importFromStringSync(lua2js(lua, { type: "module" }))).to.deep.equal(
      {
        name: "pdel",
        numberOfKeys: 1,
        lua,
      },
    );
  });
});
