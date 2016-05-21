function getParamFromLua(lua, param) {
  const match = lua.match(`--\\s*${param}\\s+([^\\s$]+)`);
  return match && match[1];
}

export function lua2js(lua, {
  name = getParamFromLua(lua, 'name'),
  numberOfKeys = getParamFromLua(lua, 'nkeys'),
} = {}) {
  const nameReplacement = (typeof(name) === 'string' && name.length) ? `'${name}'` : null;

  return `__JS_PLACEHOLDER__`
    .replace('__LUA_PLACEHOLDER__', lua)
    .replace('__NAME_PLACEHOLDER__', nameReplacement)
    .replace('__NKEYS_PLACEHOLDER__', numberOfKeys || null);
}
