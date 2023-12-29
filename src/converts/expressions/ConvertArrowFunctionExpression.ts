import { ArrowFunctionExpression, BlockStatement, Expression } from 'acorn';
import { ConvertExpression } from './ConvertExpression';
import { ConvertFunctionExpression } from './ConvertFunctionExpression';
import { convertExpressions } from '../../convert';
import { convertArgs, createFn } from '../../utils/func';
import { optionalWhiteSpace } from '../../utils/indent';

export class ConvertArrowFunctionExpression extends ConvertExpression<ArrowFunctionExpression> {
	public convert(): string {
		if (!this.expr.expression) {
			return new ConvertFunctionExpression({
				...this.expr,
				type: 'FunctionExpression',
				id: null,
				generator: false,
				body: this.expr.body as BlockStatement,
			}).convert();
		}
		else {
			let funcBody = this.expr.body as Expression;
			if (funcBody.type === 'ParenthesizedExpression') {
				funcBody = funcBody.expression;
			}
			const expression = convertExpressions(funcBody).convert();
			const params = convertArgs(this.expr.params);
			return createFn('', params, `{${optionalWhiteSpace()}${expression}${optionalWhiteSpace()}}`);
		}
	}
}
