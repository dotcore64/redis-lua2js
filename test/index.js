import fs from 'fs';
import path from 'path';
import sinon from 'sinon';
import { expect } from 'chai';
import requireFromString from 'require-from-string';

import { lua2js } from '../lib';

describe('redis-lua2js', () => {
  function testExpectation(test, expectation) {
    expect(test.name).to.equal(expectation.name);
    expect(test.lua).to.equal(expectation.lua);
    expect(test.numberOfKeys).to.equal(expectation.numberOfKeys);
  }

  function testInstall(test, expectation) {
    const spy = sinon.spy(test, 'install');
    const ioredis = { defineCommand: sinon.spy() };

    if (expectation.name !== null) {
      test.install(ioredis);
      expect(ioredis.defineCommand.calledOnce).to.equal(true);
      expect(ioredis.defineCommand.firstCall.args).to.deep.equal([
        expectation.name,
        {
          lua: expectation.lua,
          numberOfKeys: expectation.numberOfKeys,
        },
      ]);
    } else {
      expect(spy.bind(spy, ioredis)).to.throw('Lua script name is missing');
    }
    spy.restore();
  }

  describe('both', () => {
    const name = 'pdel';
    const numberOfKeys = 1;
    const lua = fs.readFileSync(path.join(__dirname, 'test_both.lua'), 'utf8');
    const test = requireFromString(lua2js(lua));
    const expectation = { name, lua, numberOfKeys };

    it('should export correct object literal', () => testExpectation(test, expectation));
    it('should install command into ioredis', () => testInstall(test, expectation));
  });

  describe('none', () => {
    const name = null;
    const numberOfKeys = null;
    const lua = fs.readFileSync(path.join(__dirname, 'test_none.lua'), 'utf8');
    const test = requireFromString(lua2js(lua));
    const expectation = { name, lua, numberOfKeys };

    it('should export correct object literal', () => testExpectation(test, expectation));
    it('should install command into ioredis', () => testInstall(test, expectation));
  });

  describe('name', () => {
    const name = 'pdel';
    const numberOfKeys = null;
    const lua = fs.readFileSync(path.join(__dirname, 'test_name.lua'), 'utf8');
    const test = requireFromString(lua2js(lua));
    const expectation = { name, lua, numberOfKeys };

    it('should export correct object literal', () => testExpectation(test, expectation));
    it('should install command into ioredis', () => testInstall(test, expectation));
  });

  describe('nkeys', () => {
    const name = null;
    const numberOfKeys = 1;
    const lua = fs.readFileSync(path.join(__dirname, 'test_nkeys.lua'), 'utf8');
    const test = requireFromString(lua2js(lua));
    const expectation = { name, lua, numberOfKeys };

    it('should export correct object literal', () => testExpectation(test, expectation));
    it('should install command into ioredis', () => testInstall(test, expectation));
  });

  describe('install', () => {
    it('should use override params when calling install', () => {
      const name = 'foo';
      const numberOfKeys = 2;
      const lua = fs.readFileSync(path.join(__dirname, 'test_both.lua'), 'utf8');
      const test = requireFromString(lua2js(lua));
      const ioredis = { defineCommand: sinon.spy() };

      test.install(ioredis, { name, numberOfKeys });
      expect(ioredis.defineCommand.calledOnce).to.equal(true);
      expect(ioredis.defineCommand.firstCall.args).to.deep.equal([
        name,
        { lua, numberOfKeys },
      ]);
    });

    it('should use override when converting lua', () => {
      const name = 'foo';
      const numberOfKeys = 2;
      const lua = fs.readFileSync(path.join(__dirname, 'test_both.lua'), 'utf8');
      const test = requireFromString(lua2js(lua, { name, numberOfKeys }));
      const ioredis = { defineCommand: sinon.spy() };

      test.install(ioredis);
      expect(ioredis.defineCommand.calledOnce).to.equal(true);
      expect(ioredis.defineCommand.firstCall.args).to.deep.equal([
        name,
        { lua, numberOfKeys },
      ]);
    });
  });
});
