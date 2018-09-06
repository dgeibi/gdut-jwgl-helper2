import babel from 'rollup-plugin-babel'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import banner from './src/banner'
import pkg from './package.json'

export default {
  input: 'src/index.js',
  plugins: [
    babel({ exclude: 'node_modules/**' }),
    nodeResolve({ jsnext: true, main: true }),
    commonjs(),
  ],
  output: [
    {
      sourcemap: false,
      strict: true,
      file: pkg.main,
      format: 'iife',
      banner,
      globals: ['$', 'courseBlackList'],
    },
  ],
}
