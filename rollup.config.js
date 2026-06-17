import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

export default {
	input: 'ts/main.ts',    // Single entry point
	output: {
		file: 'static/main.js', // Set output to a single file
		format: 'esm',         // `iife` works for single-file output
		name: 'noteofapp',
		plugins: [/*terser()*/]
	},
	plugins: [
		typescript(),
		resolve({ dedupe: ['d3-selection'] }),
		commonjs()
	]
};
