export const name = __NAME_PLACEHOLDER__;
export const lua = `__LUA_PLACEHOLDER__`;
export const numberOfKeys = __NKEYS_PLACEHOLDER__;

const tmpName = name;
const tmpNumberOfKeys = numberOfKeys;
export function install(ioredis, { name = tmpName, numberOfKeys = tmpNumberOfKeys } = {}) {
  if (typeof name !== 'string') throw new Error('Lua script name is missing');

  ioredis.defineCommand(name, {
    lua,
    numberOfKeys,
  });
}
