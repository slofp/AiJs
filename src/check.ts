import { Statement } from "meriyah/dist/src/estree";

const unsupportedStatements: readonly Statement['type'][] = [
	'ExportAllDeclaration',
	'ExportDefaultDeclaration',
	'ExportNamedDeclaration',
	'ImportDeclaration',
	'LabeledStatement',
	'ThrowStatement',
	'TryStatement',
	'WithStatement'
] as const;

export function checkUnsupportedStatement(type: Statement["type"]) {
	return unsupportedStatements.some((v) => v === type);
}
