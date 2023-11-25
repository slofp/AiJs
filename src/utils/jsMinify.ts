import { MinifyOptions, minify } from 'terser';

const options: MinifyOptions = {
	mangle: {
		keep_classnames: false,
		keep_fnames: false,
		toplevel: true,
		module: true,

	},
	compress: false,
	keep_classnames: false,
	keep_fnames: false
};

export async function minifyIdentifier(source: string) {
	const result = await minify(source, options);
	if (result.code) return result.code;
	else throw new Error('minify error');
}