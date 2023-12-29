import { MinifyOptions, minify } from 'terser';
import { base53 } from './base53';
import { excludeRegExp } from './stdProp';

const options: MinifyOptions = {
	mangle: {
		keep_classnames: false,
		keep_fnames: false,
		toplevel: true,
		module: true,
		nth_identifier: base53,
		reserved: [],
		properties: {
			//debug: 'Mangled' as unknown as boolean,
			keep_quoted: false,
			nth_identifier: base53,
			regex: excludeRegExp,
			reserved: [],
		},
	},
	compress: {
		defaults: false,
		dead_code: true,
		directives: true,
		drop_console: true,
		drop_debugger: true,
		ecma: 2020,
		evaluate: true,
		properties: true,
		passes: 2,
		module: true,
		//loops: true,
		keep_classnames: false,
		keep_fargs: false,
		keep_fnames: false,
		keep_infinity: false,
		switches: true,
		unused: true,
	},
	keep_classnames: false,
	keep_fnames: false,
	module: true,
};

export async function minifyIdentifier(source: string) {
	const result = await minify(source, options);
	if (result.code) {
		return result.code;
	}
	else {
		throw new Error('minify error');
	}
}
