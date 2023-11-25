import { parseScript } from 'meriyah';
import { convertFromProgram } from './convert';
import { ConvertOptions } from './type';
import { minifyIdentifier } from './utils/jsMinify';
import { setIndents } from './utils/indent';

export async function convert(src: string, options?: ConvertOptions) {
	let source = src;
	if (options) {
		if (options.minify) {
			source = await minifyIdentifier(source);
			setIndents(false);
		}
	}

	const program = parseScript(source);
	return convertFromProgram(program);
}
