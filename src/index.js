const { generate } = require('astring');

const getParamFromLua = (param) => (lua) => lua.match(`--\\s*${param}\\s+([^\\s$]+)`)?.[1] ?? null;
const getName = getParamFromLua('name');
const getNumberOfKeys = (lua) => {
  try {
    return parseInt(getParamFromLua('nkeys')(lua), 10);
  } catch (e) {
    return null;
  }
};

const getExportExpression = (name, value) => ({
  type: 'ExpressionStatement',
  expression: {
    type: 'AssignmentExpression',
    operator: '=',
    left: {
      type: 'MemberExpression',
      object: {
        type: 'MemberExpression',
        object: {
          type: 'Identifier',
          name: 'module',
        },
        property: {
          type: 'Identifier',
          name: 'exports',
        },
      },
      property: {
        type: 'Identifier',
        name,
      },
    },
    right: {
      type: 'Literal',
      value,
    },
  },
});

module.exports = (lua, {
  name = getName(lua),
  numberOfKeys = getNumberOfKeys(lua),
} = {}) => generate({
  type: 'Program',
  body: [
    getExportExpression('lua', lua),
    getExportExpression('name', name),
    getExportExpression('numberOfKeys', numberOfKeys),
  ],
});
