import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import arraybuffer from '@wemap/rollup-plugin-arraybuffer';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import { string } from 'rollup-plugin-string';

import pkg from './package.json' assert { type: "json" };

export default {
  input: "src/main.ts",
  meta: {
    name: "GifCaptioner",
    version: pkg.version,
    description: pkg.description,
    author: pkg.author,
    authorId: "619261917352951815",
    website: pkg.repository.url,
    source: `${pkg.repository.url}/blob/main/build/GifCaptioner.plugin.js`
  },
  plugins: [
    babel({ include: '**/*.jsx', babelHelpers: 'bundled' }),
    typescript({
        jsx: 'react'
    }),
    resolve(),
    commonjs(),
    nodePolyfills(),
    arraybuffer({ include: '**/*.otf' }),
    string({ include: [ '**/*.css', '**/*.svg' ] })
  ]
}