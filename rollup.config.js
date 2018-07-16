import path from 'path';
import camelCase from 'lodash/camelCase';

import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import progress from 'rollup-plugin-progress';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-porter';

import { peerDependencies, name } from './package.json';

const base = path.resolve(__dirname, './');
const src = path.resolve(base, 'src');
const dist = path.resolve(base, 'dist');
const debug = process.env.DEBUG === 'true';

export default {
  input: path.resolve(src, 'index.js'),
  external: Object.keys(peerDependencies),
  plugins: [
    progress(),
    resolve({ external: ['vue'] }),
    commonjs(),
    css({ dest: dist + '/vue-pikaday.css' }),
    babel({
      babelrc: false,
      presets: [
        ['env', { 'modules': false }]
      ],
      exclude: 'node_modules/**',
      plugins: ['external-helpers']
    }),
    terser({
      compress: {
        drop_console: !debug,
        drop_debugger: !debug
      }
    })
  ],
  output: [
    {
      format: 'cjs',
      name: camelCase(name),
      file: path.resolve(dist, name + '.common.js'),
      sourcemap: true,
      globals: {
        moment: 'moment',
        pikaday: 'pikaday'
      },
    },
    {
      format: 'umd',
      name: camelCase(name),
      file: path.resolve(dist, name + '.js'),
      sourcemap: true,
      globals: {
        moment: 'moment',
        pikaday: 'pikaday'
      },
    },
    {
      format: 'es',
      file: path.resolve(dist, name + '.esm.js'),
      sourcemap: true
    }
  ]
};