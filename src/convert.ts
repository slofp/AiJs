import { Expression, Pattern, PrivateIdentifier, Program, Statement } from 'acorn';
import { checkModuleDeclaration, checkUnsupportedStatement } from './check';
import { UnsupportedStatementError } from './expections/UnsupportedStatementError';
import { ConvertVariableDeclaration } from './converts/statements/ConvertVariableDeclaration';
import { ConvertLiteral } from './converts/expressions/ConvertLiteral';
import { ConvertBinaryExpression } from './converts/expressions/ConvertBinaryExpression';
import { ConvertIdentifier } from './converts/expressions/ConvertIdentifier';
import { CannotConvertError } from './expections/CannotConvertError';
import { ConvertAssignmentExpression } from './converts/expressions/ConvertAssignmentExpression';
import { ConvertExpressionStatement } from './converts/statements/ConvertExpressionStatement';
import { ConvertBlockStatement } from './converts/statements/ConvertBlockStatement';
import { ConvertFunctionDeclaration } from './converts/statements/ConvertFunctionDeclaration';
import { ConvertReturnStatement } from './converts/statements/ConvertReturnStatement';
import { ConvertCallExpression } from './converts/expressions/ConvertCallExpression';
import { ConvertTemplateLiteral } from './converts/expressions/ConvertTemplateLiteral';
import { ConvertLogicalExpression } from './converts/expressions/ConvertLogicalExpression';
import { ConvertIfStatement } from './converts/statements/ConvertIfStatement';
import { ConvertForStatement } from './converts/statements/ConvertForStatement';
import { ConvertUpdateExpression } from './converts/expressions/ConvertUpdateExpression';
import { ConvertMemberExpression } from './converts/expressions/ConvertMemberExpression';
import { ConvertArrayExpression } from './converts/expressions/ConvertArrayExpression';
import { ConvertObjectExpression } from './converts/expressions/ConvertObjectExpression';
import { ConvertFunctionExpression } from './converts/expressions/ConvertFunctionExpression';
import { ConvertArrowFunctionExpression } from './converts/expressions/ConvertArrowFunctionExpression';
import { ConvertWhileStatement } from './converts/statements/ConvertWhileStatement';
import { ConvertDoWhileStatement } from './converts/statements/ConvertDoWhileStatement';
import { ConvertBreakStatement } from './converts/statements/ConvertBreakStatement';
import { ConvertContinueStatement } from './converts/statements/ConvertContinueStatement';
import { ConvertForOfStatement } from './converts/statements/ConvertForOfStatement';
import { ConvertConditionalExpression } from './converts/expressions/ConvertConditionalExpression';
import { NotImplementError } from './expections/NotImplementError';
import { INode } from './converts/INode';
import { ConvertParenthesizedExpression } from './converts/expressions/ConvertParenthesizedExpression';

export function convertPatterns(pat: Pattern): INode {
	switch (pat.type) {
		case 'Identifier':
			return new ConvertIdentifier(pat);
		case 'MemberExpression':
			return new ConvertMemberExpression(pat);
		//case 'RestElement':
		// 出現: 関数
		// 文法: function(...pat) {}
		//case 'ArrayPattern':
		// 出現: 関数
		// 文法: function([id, id]) {}
		//case 'AssignmentPattern':
		// 出現: 関数
		// 文法: function(id = expr) {}
		//case 'ObjectPattern':
		// 出現: 関数
		// 文法: function({id, id}) {}
		default:
			throw new NotImplementError(`${pat.type}は未実装です`, pat.loc?.start, pat.loc?.end);
	}
}

export function convertStatements(state: Statement, isEval = true): INode {
	if (checkUnsupportedStatement(state.type)) {
		throw new UnsupportedStatementError(`${state.type}はサポートされません`, state.loc?.start, state.loc?.end);
	}

	switch (state.type) {
		case 'VariableDeclaration':
			return new ConvertVariableDeclaration(state);
		case 'FunctionDeclaration':
			return new ConvertFunctionDeclaration(state);
		case 'ExpressionStatement':
			return new ConvertExpressionStatement(state);
		case 'BlockStatement':
			return new ConvertBlockStatement(state, isEval);
		case 'ReturnStatement':
			return new ConvertReturnStatement(state);
		case 'IfStatement':
			return new ConvertIfStatement(state);
		case 'ForStatement':
			return new ConvertForStatement(state);
		case 'WhileStatement':
			return new ConvertWhileStatement(state);
		case 'DoWhileStatement':
			return new ConvertDoWhileStatement(state);
		case 'BreakStatement':
			return new ConvertBreakStatement(state);
		case 'ContinueStatement':
			return new ConvertContinueStatement(state);
		case 'ForOfStatement':
			return new ConvertForOfStatement(state);
		default:
			throw new NotImplementError(`${state.type}は未実装です`, state.loc?.start, state.loc?.end);
	}
}

export function convertExpressions(expr: Expression | PrivateIdentifier, fromState = false): INode {
	switch (expr.type) {
		case 'Literal':
			return new ConvertLiteral(expr);
		case 'BinaryExpression':
			return new ConvertBinaryExpression(expr);
		case 'Identifier':
			return new ConvertIdentifier(expr);
		case 'AssignmentExpression':
			if (!fromState) {
				throw new CannotConvertError('式に代入は使えません', expr.loc?.start, expr.loc?.end);
			}
			return new ConvertAssignmentExpression(expr);
		case 'CallExpression':
			return new ConvertCallExpression(expr);
		case 'TemplateLiteral':
			return new ConvertTemplateLiteral(expr);
		case 'LogicalExpression':
			return new ConvertLogicalExpression(expr);
		case 'UpdateExpression':
			return new ConvertUpdateExpression(expr, fromState);
		case 'MemberExpression':
			return new ConvertMemberExpression(expr);
		case 'ArrayExpression':
			return new ConvertArrayExpression(expr);
		case 'ObjectExpression':
			return new ConvertObjectExpression(expr);
		case 'FunctionExpression':
			return new ConvertFunctionExpression(expr);
		case 'ArrowFunctionExpression':
			return new ConvertArrowFunctionExpression(expr);
		case 'ConditionalExpression':
			return new ConvertConditionalExpression(expr);
		case 'ParenthesizedExpression':
			return new ConvertParenthesizedExpression(expr);
		default:
			throw new NotImplementError(`${expr.type}は未実装です`, expr.loc?.start, expr.loc?.end);
	}
}

export function convertFromProgram(program: Program) {
	const bodyConvert: INode[] = [];

	for (const state of program.body) {
		if (checkModuleDeclaration(state)) {
			throw new UnsupportedStatementError('import/exportは使用できません', state.loc?.start, state.loc?.end);
		}
		bodyConvert.push(convertStatements(state));
	}

	return bodyConvert.map((v) => v.convert()).join('\n');
}
