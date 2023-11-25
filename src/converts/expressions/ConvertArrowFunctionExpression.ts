import { ArrowFunctionExpression, BlockStatement, Expression } from "meriyah/dist/src/estree";
import { ConvertExpression } from "./ConvertExpression";
import { ConvertFunctionExpression } from "./ConvertFunctionExpression";
import { convertExpressions } from "../../convert";
import { convertArgs, createFn } from "../../utils/func";
import { optionalWhiteSpace } from "../../utils/indent";

export class ConvertArrowFunctionExpression extends ConvertExpression<ArrowFunctionExpression> {
	public convert(): string {
		if (!this.expr.expression) {
			return new ConvertFunctionExpression({
				...this.expr,
				type: 'FunctionExpression',
				id: null,
				generator: false,
				body: this.expr.body as BlockStatement
			}).convert();
		}
		else {
			const expression = convertExpressions(this.expr.body as Expression).convert();
			const params = convertArgs(this.expr.params);
			return createFn('', params, `{${optionalWhiteSpace()}${expression}${optionalWhiteSpace()}}`);
		}
	}
}
