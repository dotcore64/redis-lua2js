import { join } from "node:path";
import { readFile } from "node:fs/promises";
import { expect } from "chai";
import { requireFromString, importFromStringSync } from "module-from-string";

// https://github.com/import-js/eslint-plugin-import/issues/1649
// eslint-disable-next-line import/no-unresolved
import lua2js from "redis-lua2js";

describe("redis-lua2js", () => {
  it("should export name and numberOfKeys from lua", () =>
    readFile(
      // eslint-disable-next-line n/no-unsupported-features/node-builtins
      join(import.meta.dirname, "test_both.lua"),
      "utf8",
    ).then((lua) =>
      expect(requireFromString(lua2js(lua))).to.deep.equal({
        name: "pdel",
        numberOfKeys: 1,
        lua,
      }),
    ));

  it("should return null name and numeberOfKeys", () =>
    readFile(
      // eslint-disable-next-line n/no-unsupported-features/node-builtins
      join(import.meta.dirname, "test_none.lua"),
      "utf8",
    ).then((lua) =>
      expect(requireFromString(lua2js(lua))).to.deep.equal({
        name: null,
        numberOfKeys: null,
        lua,
      }),
    ));

  it("should export name from lua and null numberOfKeys", () =>
    readFile(
      // eslint-disable-next-line n/no-unsupported-features/node-builtins
      join(import.meta.dirname, "test_name.lua"),
      "utf8",
    ).then((lua) =>
      expect(requireFromString(lua2js(lua))).to.deep.equal({
        name: "pdel",
        numberOfKeys: null,
        lua,
      }),
    ));

  it("should export null name and numberOfKeys from lua", () =>
    readFile(
      // eslint-disable-next-line n/no-unsupported-features/node-builtins
      join(import.meta.dirname, "test_nkeys.lua"),
      "utf8",
    ).then((lua) =>
      expect(requireFromString(lua2js(lua))).to.deep.equal({
        name: null,
        numberOfKeys: 1,
        lua,
      }),
    ));

  it("should generate esm module", () =>
    readFile(
      // eslint-disable-next-line n/no-unsupported-features/node-builtins
      join(import.meta.dirname, "test_both.lua"),
      "utf8",
    ).then((lua) =>
      expect(
        importFromStringSync(lua2js(lua, { type: "module" })),
      ).to.deep.equal({
        name: "pdel",
        numberOfKeys: 1,
        lua,
      }),
    ));
});
