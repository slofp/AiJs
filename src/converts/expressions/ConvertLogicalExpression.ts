import { LogicalExpression } from "meriyah/dist/src/estree";
import { ConvertExpression } from "./ConvertExpression";
import { convertExpressions } from "../../convert";
import { optionalWhiteSpace } from "../../utils/indent";

const logicalOperator = [
	'&&',
	'||'
] as const;
type logicalExpression = LogicalExpression & {
	operator: typeof logicalOperator[number]
};

export class ConvertLogicalExpression extends ConvertExpression<logicalExpression> {
	private static checkOperator(expr: LogicalExpression): expr is logicalExpression {
		return logicalOperator.some(v => v === expr.operator);
	}

	public constructor(expr: LogicalExpression) {
		if (!ConvertLogicalExpression.checkOperator(expr)) {
			throw new Error('Unknown logical operator');
		}

		super(expr);
	}

	public convert(): string {
		const left = convertExpressions(this.expr.left).convert();
		const right = convertExpressions(this.expr.right).convert();

		return `${left}${optionalWhiteSpace()}${this.expr.operator}${optionalWhiteSpace()}${right}`;
	}
}
