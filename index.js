import { generate } from 'astring';

const getParamFromLua = (param) => (lua) => lua.match(`--\\s*${param}\\s+([^\\s$]+)`)?.[1] ?? null;
const getName = getParamFromLua('name');
const getNumberOfKeys = (lua) => {
  try {
    return parseInt(getParamFromLua('nkeys')(lua), 10);
  } catch (e) {
    return null;
  }
};

const getCjsExportExpression = (name, value) => ({
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

const getEsmExportExpression = (name, value) => ({
  type: 'ExpressionStatement',
  expression: {
    type: 'ExportNamedDeclaration',
    declaration: {
      type: 'VariableDeclaration',
      declarations: [
        {
          type: 'VariableDeclarator',
          id: {
            type: 'Identifier',
            name,
          },
          init: {
            type: 'Literal',
            value,
          },
        },
      ],
      kind: 'const',
    },
    specifiers: [],
    source: null,
  },
});

export default (lua, {
  name = getName(lua),
  numberOfKeys = getNumberOfKeys(lua),
  type = 'commonjs',
} = {}) => generate({
  type: 'Program',
  body: type === 'commonjs' ? [ // eslint-disable-line no-nested-ternary
    getCjsExportExpression('lua', lua),
    getCjsExportExpression('name', name),
    getCjsExportExpression('numberOfKeys', numberOfKeys),
  ] : type === 'module' ? [
    getEsmExportExpression('lua', lua),
    getEsmExportExpression('name', name),
    getEsmExportExpression('numberOfKeys', numberOfKeys),
  ] : (() => { throw new Error('type must be commonjs | module'); })(),
  ...(type === 'module' && { sourceType: 'module' }),
});
