import { ClassBody, Expression, ObjectLiteralElementLike, Statement } from "meriyah/dist/src/estree";

function existsClassBodyVariable(body: ClassBody, name: string): boolean {
	for (const b of body.body) {
		switch (b.type) {
			case 'FunctionExpression':
				if (b.body?.body.some(v => existsVariable(v, name)) ?? false) {
					return true;
				}
				break;
			case 'MethodDefinition':
				if (b.value.body?.body.some(v => existsVariable(v, name)) ?? false) {
					return true;
				}
				break;
			case 'StaticBlock':
				if (b.body.some(v => existsVariable(v, name))) {
					return true;
				}
				break;
			case 'PropertyDefinition':
				break;
		}
	}

	return false;
}

function existsObjectLiteralVariable(objectLiteral: ObjectLiteralElementLike, name: string): boolean {
	switch (objectLiteral.type) {
		case 'MethodDefinition':
			return objectLiteral.value.body?.body.some(v => existsVariable(v, name)) ?? false;
		case 'Property':
			if (objectLiteral.value.type === 'AssignmentPattern') {
				return existsExpressionVariable(objectLiteral.value.left, name) || objectLiteral.value.right ? existsExpressionVariable(objectLiteral.value.left, name) : false;
			}
			return existsExpressionVariable(objectLiteral.value, name);
		case 'RestElement':
		case 'SpreadElement':
			return existsExpressionVariable(objectLiteral, name);
	}
}

function existsExpressionVariable(expr: Expression, name: string): boolean {
	switch (expr.type) {
		case 'ArrayExpression':
			return expr.elements.some(v => v ? existsExpressionVariable(v, name) : false);
		case 'ArrayPattern':
			return expr.elements.some(v => existsExpressionVariable(v, name));
		case 'ArrowFunctionExpression':
			return expr.params.some(v => {
				if (v.type === 'AssignmentPattern') return (
					existsExpressionVariable(v.left, name) ||
					(v.right && existsExpressionVariable(v.right, name))
				);
				return existsExpressionVariable(v, name);
			}) || expr.expression ? existsExpressionVariable(expr.body as Expression, name) : existsVariable(expr.body as Statement, name);
		case 'AssignmentExpression':
		case 'BinaryExpression':
		case 'LogicalExpression':
			return existsExpressionVariable(expr.left, name) || existsExpressionVariable(expr.right, name);
		case 'AwaitExpression':
			return existsExpressionVariable(expr.argument, name);
		case 'CallExpression':
			return expr.arguments.some(v => existsExpressionVariable(v, name)) || existsExpressionVariable(expr.callee, name);
		case 'ChainExpression':
			return existsExpressionVariable(expr.expression, name);
		case 'ClassDeclaration':
		case 'ClassExpression':
			return existsClassBodyVariable(expr.body, name);
		case 'ConditionalExpression':
			return existsExpressionVariable(expr.test, name) || existsExpressionVariable(expr.consequent, name) || existsExpressionVariable(expr.alternate, name);
		case 'FunctionExpression':
			return expr.body?.body.some(v => existsVariable(v, name)) ?? false;
		case 'Identifier':
			return expr.name === name;
		case 'MemberExpression':
			return existsExpressionVariable(expr.object, name);
		case 'ObjectExpression':
		case 'ObjectPattern':
			return expr.properties.some(v => existsObjectLiteralVariable(v, name));
		case 'SequenceExpression':
		case 'TemplateLiteral':
			return expr.expressions.some(v => existsExpressionVariable(v, name));
		case 'UnaryExpression':
		case 'UpdateExpression':
			return existsExpressionVariable(expr.argument, name);
		case 'YieldExpression':
			return expr.argument ? existsExpressionVariable(expr.argument, name) : false;
		case 'Import':
		case 'ImportExpression':
		case 'JSXClosingElement':
		case 'JSXClosingFragment':
		case 'JSXElement':
		case 'JSXExpressionContainer':
		case 'JSXFragment':
		case 'JSXOpeningElement':
		case 'JSXOpeningFragment':
		case 'JSXSpreadChild':
		case 'Literal':
		case 'MetaProperty':
		case 'NewExpression':
		case 'RestElement':
		case 'SpreadElement':
		case 'Super':
		case 'TaggedTemplateExpression':
		case 'ThisExpression':
			return false;
	}
}

export function existsVariable(state: Statement, name: string): boolean {
	switch (state.type) {
		case 'BlockStatement':
			return state.body.some(v => existsVariable(v, name));
		case 'ClassDeclaration':
		case 'ClassExpression':
			return existsClassBodyVariable(state.body, name);
		case 'DoWhileStatement':
			return existsExpressionVariable(state.test, name) || existsVariable(state.body, name);
		case 'ExpressionStatement':
			return existsExpressionVariable(state.expression, name);
		case 'ForInStatement':
		case 'ForOfStatement':
			return existsExpressionVariable(state.right, name) || existsVariable(state.body, name);
		case 'ForStatement':
			if (state.init) {
				let finish = false;
				if (state.init.type === 'VariableDeclaration') {
					finish = existsVariable(state.init, name);
				}
				else {
					finish = existsExpressionVariable(state.init, name);
				}
				if (finish) return true;
			}
			return (state.test ? existsExpressionVariable(state.test, name) : false) || existsVariable(state.body, name);
		case 'FunctionDeclaration':
			return state.body?.body.some(v => existsVariable(v, name)) ?? false;
		case 'IfStatement':
			return existsExpressionVariable(state.test, name) || existsVariable(state.consequent, name) || (state.alternate ? existsVariable(state.alternate, name) : false);
		case 'ReturnStatement':
			return state.argument ? existsExpressionVariable(state.argument, name) : false;
		case 'SwitchStatement':
			return existsExpressionVariable(state.discriminant, name) || state.cases.some(v => (v.test ? existsExpressionVariable(v.test, name) : false) || v.consequent.some(vs => existsVariable(vs, name)));
		case 'VariableDeclaration':
			return state.declarations.some(v => existsExpressionVariable(v.id, name) || (v.init ? existsExpressionVariable(v.init, name) : false));
		case 'WhileStatement':
			return existsExpressionVariable(state.test, name) || existsVariable(state.body, name);
		case 'TryStatement': // 非対応
		case 'ThrowStatement': // 非対応
		case 'DebuggerStatement':
		case 'LabeledStatement': // 非対応
		case 'ExportDefaultDeclaration':
		case 'ExportNamedDeclaration':
		case 'ExportAllDeclaration':
		case 'ImportDeclaration':
		case 'WithStatement':
		case 'ContinueStatement':
		case 'EmptyStatement':
		case 'BreakStatement':
			return false;
	}
}
