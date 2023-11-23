import { BinaryExpression } from "meriyah/dist/src/estree";
import { ConvertExpression } from "./ConvertExpression";
import { UnsupportedOperatorError } from "../../expections/UnsupportedOperatorError";
import { convertExpressions } from "../../convert";
import { toMathPow } from "../../utils/mathLib";

// && と || と ?? は Binaryではない
const binaryOperator = [
	'+',
	'&',
	'|',
	'^',
	'/',
	'==',
	'**',
	'>',
	'>=',
	'!=',
	'<<',
	'<',
	'<=',
	'*',
	'%',
	'>>',
	'===',
	'!==',
	'-',
	'>>>'
] as const;
const unsupportedBinaryOperator = [
	'&',
	'|',
	'^',
	'<<',
	'>>',
	'>>>'
] as const;
type binaryExpression = BinaryExpression & {
	operator: Exclude<typeof binaryOperator[number], typeof unsupportedBinaryOperator[number]>;
};

export class ConvertBinaryExpression extends ConvertExpression<binaryExpression> {
	private static checkOperator(expr: BinaryExpression): boolean {
		return binaryOperator.some(v => v === expr.operator);
	}

	private static isNotUnsupportedOperator(expr: BinaryExpression): expr is binaryExpression {
		return !unsupportedBinaryOperator.some(v => v === expr.operator);
	}

	public constructor(expr: BinaryExpression) {
		if (!ConvertBinaryExpression.checkOperator(expr)) {
			throw new Error('Unknown operator');
		}
		if (!ConvertBinaryExpression.isNotUnsupportedOperator(expr)) {
			throw new UnsupportedOperatorError(`${expr.operator}演算子は対応していません`);
		}
		super(expr);
	}

	private toAiScript(left: string, right: string) {
		let op = this.expr.operator;
		if (op === '!==') {
			op = '!=';
		}
		else if (op === '===') {
			op = '==';
		}

		switch (op) {
			case '**':
				return toMathPow(left, right);
			default:
				return `${left} ${op} ${right}`;
		}
	}

	public convert(): string {
		const left = convertExpressions(this.expr.left).convert();
		const right = convertExpressions(this.expr.right).convert();

		return this.toAiScript(left, right);
	}
}
