const getTarget = env => env('test') ? 'current' : '10';

module.exports = ({ env }) => ({
  presets: [['@babel/preset-env', { targets: { node: getTarget(env) } }]],
  plugins: env('test') ? ['istanbul'] : [],
});
