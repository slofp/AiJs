import { parseScript } from 'meriyah';
import { convertFromProgram } from './convert';

export function convert(src: string): string {
	const program = parseScript(src);
	return convertFromProgram(program);
}
