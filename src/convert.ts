import { Expression, Program, Statement } from "meriyah/dist/src/estree";
import { checkUnsupportedStatement } from "./check";
import { UnsupportedStatementError } from "./expections/UnsupportedStatementError";
import { type ConvertStatement } from "./converts/statements/ConvertStatement";
import { ConvertVariableDeclaration } from "./converts/statements/ConvertVariableDeclaration";
import { ConvertExpression } from './converts/expressions/ConvertExpression';
import { ConvertLiteral } from "./converts/expressions/ConvertLiteral";
import { ConvertBinaryExpression } from "./converts/expressions/ConvertBinaryExpression";
import { ConvertIdentifier } from './converts/expressions/ConvertIdentifier';
import { CannotConvertError } from "./expections/CannotConvertError";
import { ConvertAssignmentExpression } from "./converts/expressions/ConvertAssignmentExpression";
import { ConvertExpressionStatement } from './converts/statements/ConvertExpressionStatement';
import { ConvertBlockStatement } from "./converts/statements/ConvertBlockStatement";
import { ConvertFunctionDeclaration } from "./converts/statements/ConvertFunctionDeclaration";
import { ConvertReturnStatement } from "./converts/statements/ConvertReturnStatement";
import { ConvertCallExpression } from "./converts/expressions/ConvertCallExpression";
import { ConvertTemplateLiteral } from './converts/expressions/ConvertTemplateLiteral';
import { ConvertLogicalExpression } from "./converts/expressions/ConvertLogicalExpression";
import { ConvertIfStatement } from "./converts/statements/ConvertIfStatement";
import { ConvertForStatement } from './converts/statements/ConvertForStatement';
import { ConvertUpdateExpression } from "./converts/expressions/ConvertUpdateExpression";
import { ConvertMemberExpression } from "./converts/expressions/ConvertMemberExpression";
import { ConvertArrayExpression } from "./converts/expressions/ConvertArrayExpression";
import { ConvertObjectExpression } from "./converts/expressions/ConvertObjectExpression";
import { ConvertFunctionExpression } from "./converts/expressions/ConvertFunctionExpression";
import { ConvertArrowFunctionExpression } from "./converts/expressions/ConvertArrowFunctionExpression";
import { ConvertWhileStatement } from "./converts/statements/ConvertWhileStatement";
import { ConvertDoWhileStatement } from './converts/statements/ConvertDoWhileStatement';
import { ConvertBreakStatement } from "./converts/statements/ConvertBreakStatement";
import { ConvertContinueStatement } from "./converts/statements/ConvertContinueStatement";
import { ConvertForOfStatement } from "./converts/statements/ConvertForOfStatement";

export function convertStatements(state: Statement, isEval = true): ConvertStatement<any> {
	if (checkUnsupportedStatement(state.type)) {
		throw new UnsupportedStatementError();
	}

	switch (state.type) {
		case "VariableDeclaration":
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
			throw new Error(`${state.type}は未実装です`);
	}
}

export function convertExpressions(expr: Expression, fromState = false): ConvertExpression<any> {
	switch (expr.type) {
		case 'Literal':
			return new ConvertLiteral(expr);
		case 'BinaryExpression':
			return new ConvertBinaryExpression(expr);
		case 'Identifier':
			return new ConvertIdentifier(expr);
		case 'AssignmentExpression':
			if (!fromState) {
				throw new CannotConvertError();
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
		default:
			throw new Error(`${expr.type}は未実装です`);
	}
}

export function convertFromProgram(program: Program) {
	const bodyConvert: ConvertStatement<any>[] = [];

	for (const state of program.body) {
		bodyConvert.push(convertStatements(state));
	}

	return bodyConvert.map(v => v.convert()).join('\n');
}
