import { MinifyOptions, minify } from 'terser';
import { base53 } from './base53';

const options: MinifyOptions = {
	mangle: {
		keep_classnames: false,
		keep_fnames: false,
		toplevel: true,
		module: true,
		nth_identifier: base53,
	},
	compress: false,
	keep_classnames: false,
	keep_fnames: false,
};

export async function minifyIdentifier(source: string) {
	const result = await minify(source, options);
	if (result.code) return result.code;
	else throw new Error('minify error');
}