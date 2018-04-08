const buble = require('rollup-plugin-buble');
const replace = require('rollup-plugin-replace');
const version = process.env.VERSION || require('../package.json').version;

const isEsm = process.env.ESM;
const banner =
`/**
 * paystar-js v${version}
 * (c) ${new Date().getFullYear()} iboying(weboying@gmail.com)
 * @license MIT
 */`;
export default {
  input: 'src/index.js',
  output: {
    file: isEsm ? 'dist/paystar.esm.js' : 'dist/paystar.js',
    format: isEsm ? 'es' : 'cjs',
    name: 'paystar-js',
    banner,
  },
  plugins: [
    replace({
      __VERSION__: version,
    }),
    buble(),
  ],
};
