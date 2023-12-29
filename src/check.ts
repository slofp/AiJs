import { ModuleDeclaration, Statement, Node } from 'acorn';

const unsupportedStatements: readonly Statement['type'][] = ['LabeledStatement', 'ThrowStatement', 'TryStatement', 'WithStatement'] as const;

const moduleDeclarationTypes: readonly ModuleDeclaration['type'][] = [
	'ExportAllDeclaration',
	'ExportDefaultDeclaration',
	'ExportNamedDeclaration',
	'ImportDeclaration',
];

export function checkUnsupportedStatement(type: Statement['type']) {
	return unsupportedStatements.some((v) => v === type);
}

export function checkModuleDeclaration(bodyLeaf: Node): bodyLeaf is ModuleDeclaration {
	return moduleDeclarationTypes.some((v) => v === bodyLeaf.type);
}
