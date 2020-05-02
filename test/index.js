const { readFileSync } = require('fs');
const { join } = require('path');
const { expect } = require('chai');
const requireFromString = require('require-from-string');

const lua2js = require('..');

describe('redis-lua2js', () => {
  it('should export name and numberOfKeys from lua', () => {
    const lua = readFileSync(join(__dirname, 'test_both.lua'), 'utf8');

    expect(requireFromString(lua2js(lua))).to.deep.equal({
      name: 'pdel',
      numberOfKeys: 1,
      lua,
    });
  });

  it('should return null name and numeberOfKeys', () => {
    const lua = readFileSync(join(__dirname, 'test_none.lua'), 'utf8');

    expect(requireFromString(lua2js(lua))).to.deep.equal({
      name: null,
      numberOfKeys: null,
      lua,
    });
  });

  it('should export name from lua and null numberOfKeys', () => {
    const lua = readFileSync(join(__dirname, 'test_name.lua'), 'utf8');

    expect(requireFromString(lua2js(lua))).to.deep.equal({
      name: 'pdel',
      numberOfKeys: null,
      lua,
    });
  });

  it('should export null name and numberOfKeys from lua', () => {
    const lua = readFileSync(join(__dirname, 'test_nkeys.lua'), 'utf8');

    expect(requireFromString(lua2js(lua))).to.deep.equal({
      name: null,
      numberOfKeys: 1,
      lua,
    });
  });
});
