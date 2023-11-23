import { AssignmentExpression } from "meriyah/dist/src/estree";
import { ConvertExpression } from "./ConvertExpression";
import { convertExpressions } from '../../convert';
import { UnsupportedOperatorError } from "../../expections/UnsupportedOperatorError";
import { toMathPow } from "../../utils/mathLib";

const assignOperator = [
	'=',
	'+=',
	'-=',
	'*=',
	'%=',
	'&=',
	'|=',
	'^=',
	'/=',
	'**=',
	'<<=',
	'&&=',
	'||=',
	'??=',
	'>>=',
	'>>>='
] as const;
const unsupportedAssignOperator = [
	'&=',
	'|=',
	'^=',
	'<<=',
	'??=',
	'>>=',
	'>>>='
] as const;
type assignmentExpression = AssignmentExpression & {
	operator: Exclude<typeof assignOperator[number], typeof unsupportedAssignOperator[number]>;
};

export class ConvertAssignmentExpression extends ConvertExpression<assignmentExpression> {
	private static checkOperator(expr: AssignmentExpression): boolean {
		return assignOperator.some(v => v === expr.operator);
	}

	private static isNotUnsupportedOperator(expr: AssignmentExpression): expr is assignmentExpression {
		return !unsupportedAssignOperator.some(v => v === expr.operator);
	}

	public constructor(expr: AssignmentExpression) {
		if (!ConvertAssignmentExpression.checkOperator(expr)) {
			throw new Error('Unknown operator');
		}
		if (!ConvertAssignmentExpression.isNotUnsupportedOperator(expr)) {
			throw new UnsupportedOperatorError(`${expr.operator}代入演算子は対応していません`);
		}
		super(expr);
	}

	private toAiScript(left: string, right: string) {
		switch (this.expr.operator) {
			case '**=':
				return `${left} = ${toMathPow(left, right)}`;
			case '%=':
			case '&&=':
			case '*=':
			case '/=':
			case '||=':
				// TODO: 計算や比較を使用しないものは括弧をなくす
				return `${left} = ${left} ${this.expr.operator.replace('=', '')} (${right})`;
			default:
				return `${left} ${this.expr.operator} ${right}`;
		}
	}

	public convert(): string {
		const left = convertExpressions(this.expr.left).convert();
		const right = convertExpressions(this.expr.right).convert();

		return this.toAiScript(left, right);
	}
}
