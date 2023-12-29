import { Pattern } from 'acorn';
import { optionalWhiteSpace } from './indent';
import { convertPatterns } from '../convert';

export function convertArgs(params: Pattern[]) {
	const result: string[] = [];
	for (const param of params) {
		result.push(convertPatterns(param).convert());
	}

	return result;
}

export function createFn(name: string, args: string[], body: string) {
	const arg = args.join(`,${optionalWhiteSpace()}`);
	return `@${name}(${arg})${optionalWhiteSpace()}${body}`;
}
