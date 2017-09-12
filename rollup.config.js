import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import banner from './src/banner';
import pkg from './package.json';

export default {
  input: 'src/index.js',
  strict: true,
  sourcemap: false,
  plugins: [
    babel({ runtimeHelpers: true, exclude: 'node_modules/**' }),
    nodeResolve({ jsnext: true, main: true }),
    commonjs(),
  ],
  globals: ['$', 'courseBlackList'],
  output: [{ file: pkg.main, format: 'iife' }],
  banner,
};
