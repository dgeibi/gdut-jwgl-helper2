import buble from 'rollup-plugin-buble';
import nodeResolve from 'rollup-plugin-node-resolve';
import banner from './src/banner';
import pkg from './package.json';

export default {
  input: 'src/index.js',
  strict: true,
  sourceMap: false,
  plugins: [buble(), nodeResolve({ jsnext: true, main: true })],
  globals: ['$', 'courseBlackList'],
  output: [{ file: pkg.main, format: 'iife' }],
  banner,
};
