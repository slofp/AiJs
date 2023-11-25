import { Parameter } from "meriyah/dist/src/estree";
import { optionalWhiteSpace } from "./indent";

export function convertArgs(params: Parameter[]) {
	const result: string[] = [];
	for (const param of params) {
		// TODO: arg=default、[arg]、{arg}をサポートする
		if (param.type !== 'Identifier') {
			throw new Error('未実装の引数情報');
		}

		result.push(param.name);
	}

	return result;
}

export function createFn(name: string, args: string[], body: string) {
	const arg = args.join(`,${optionalWhiteSpace()}`);
	return `@${name}(${arg})${optionalWhiteSpace()}${body}`;
}
