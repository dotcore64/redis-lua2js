# redis-lua2js

[![Travis][build-badge]][build]
[![npm package][npm-badge]][npm]
[![Coverage Status][coveralls-badge]][coveralls]
[![Dependency Status][dependency-status-badge]][dependency-status]
[![devDependency Status][dev-dependency-status-badge]][dev-dependency-status]

> convert redis lua scripts to a useful node module

## Install

```
$ npm install --save-dev redis-lua2js
```

## Usage

This module is not meant to be used on its own, but rather as part of another module, such as [gulp-redis-lua2js](https://github.com/dotcore64/gulp-redis-lua2js) or [hook-redis-lua](https://github.com/dotcore64/node-hook-redis-lua). In here, I will demonstrate the usage with the help of [require-from-string](https://github.com/floatdrop/require-from-string):

index.js:
```js
import Redis from 'ioredis';
import fs from 'fs';
import path from 'path';
import lua2js from 'redis-lua2js';

const ioredis = new Redis();
const lua = fs.readFileSync(path.join(__dirname, 'pdel.lua'));
const js = lua2js(lua); // This is a node module string, the template of which you can see in src/lua.js
const pdel = requireFromString(js); // Parse the module as a string

ioredis.defineCommand(pdel.name, {
  lua: pdel.lua,
  numberOfKeys: pdel.numberOfKeys,
});
ioredis.pdel('*');
```

pdel.lua:
```lua
--!/usr/bin/env lua
-- name pdel
-- nkeys 1

local function deleteKeys (keys)
  for i, name in ipairs(keys) do
    redis.call("DEL", name)
  end
end

if type(redis.replicate_commands) == 'function' and redis.replicate_commands() then -- Redis 3.2+
  local count = 0
  local cursor = "0"
  local keys

  repeat
    cursor, keys = unpack(redis.call("SCAN", cursor, "MATCH", KEYS[1]))
    count = count + #keys
    deleteKeys(keys)
  until cursor == "0"

  return count
else
  local keys = redis.call("KEYS", KEYS[1])
  deleteKeys(keys)
  return #keys
end
```

## API

### lua2js(lua, { name, numberOfKeys })

Takes the contents of a lua script and outputs a node module, as a string, which can be used to load the script into a redis client such as `ioredis` easily.

#### lua

Type: `string`, the contents of a lua script

#### name

Type: `string?`

By default it is parsed from the comments of the lua script, as demonstrated in the `Usage` section

The name of the redis command, will be used when installing to `ioredis`

#### numberOfKeys

Type: `string?`, 

By default it is parsed from the comments of the lua script, as demonstrated in the `Usage` section

The number of keys that the redis command accepts


The parsed module will export the following:

### name

Type: `string | null`, contains the name from the API above

### numberOfKeys

Type: `integer | null`, contains the value of the number of keys argument from the API above

### lua

Type: `string`, contains the contents of the lua script, useful for manually installing the script, for example, with `ioredis.defineCommand`

## License

See the [LICENSE](LICENSE.md) file for license rights and limitations (MIT).

[build-badge]: https://img.shields.io/travis/dotcore64/redis-lua2js/master.svg?style=flat-square
[build]: https://travis-ci.org/dotcore64/redis-lua2js

[npm-badge]: https://img.shields.io/npm/v/redis-lua2js.svg?style=flat-square
[npm]: https://www.npmjs.org/package/redis-lua2js

[coveralls-badge]: https://img.shields.io/coveralls/dotcore64/redis-lua2js/master.svg?style=flat-square
[coveralls]: https://coveralls.io/r/dotcore64/redis-lua2js

[dependency-status-badge]: https://david-dm.org/dotcore64/redis-lua2js.svg?style=flat-square
[dependency-status]: https://david-dm.org/dotcore64/redis-lua2js

[dev-dependency-status-badge]: https://david-dm.org/dotcore64/redis-lua2js/dev-status.svg?style=flat-square
[dev-dependency-status]: https://david-dm.org/dotcore64/redis-lua2js#info=devDependencies
