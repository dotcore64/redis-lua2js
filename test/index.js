import { join } from 'path';
import { readFileSync } from 'fs';
import { createRequire } from 'module';
import { expect } from 'chai';
import { requireFromString, importFromStringSync } from 'module-from-string';
import { dirname } from 'dirname-filename-esm';

// https://github.com/import-js/eslint-plugin-import/issues/1649
// eslint-disable-next-line import/no-unresolved,node/no-missing-import
import lua2js from 'redis-lua2js';

describe('redis-lua2js', () => {
  it('should export name and numberOfKeys from lua', () => {
    const lua = readFileSync(join(dirname(import.meta), 'test_both.lua'), 'utf8');

    expect(requireFromString(lua2js(lua))).to.deep.equal({
      name: 'pdel',
      numberOfKeys: 1,
      lua,
    });
  });

  it('should return null name and numeberOfKeys', () => {
    const lua = readFileSync(join(dirname(import.meta), 'test_none.lua'), 'utf8');

    expect(requireFromString(lua2js(lua))).to.deep.equal({
      name: null,
      numberOfKeys: null,
      lua,
    });
  });

  it('should export name from lua and null numberOfKeys', () => {
    const lua = readFileSync(join(dirname(import.meta), 'test_name.lua'), 'utf8');

    expect(requireFromString(lua2js(lua))).to.deep.equal({
      name: 'pdel',
      numberOfKeys: null,
      lua,
    });
  });

  it('should export null name and numberOfKeys from lua', () => {
    const lua = readFileSync(join(dirname(import.meta), 'test_nkeys.lua'), 'utf8');

    expect(requireFromString(lua2js(lua))).to.deep.equal({
      name: null,
      numberOfKeys: 1,
      lua,
    });
  });

  it('should generate esm module', () => {
    const lua = readFileSync(join(dirname(import.meta), 'test_both.lua'), 'utf8');

    expect(importFromStringSync(lua2js(lua, { type: 'module' }))).to.deep.equal({
      name: 'pdel',
      numberOfKeys: 1,
      lua,
    });
  });

  it('should require cjs module', () => {
    const require = createRequire(import.meta.url);
    expect(require('..')).to.be.a('function');
  });
});
