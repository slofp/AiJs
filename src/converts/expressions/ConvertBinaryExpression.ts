import { BinaryExpression } from "meriyah/dist/src/estree";
import { ConvertExpression } from "./ConvertExpression";
import { UnsupportedOperatorError } from "../../expections/UnsupportedOperatorError";
import { convertExpressions } from "../../convert";
import { toMathPow } from "../../utils/mathLib";
import { optionalWhiteSpace } from "../../utils/indent";

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
	private static getOperatorPrecedence(op: binaryExpression['operator']) {
		switch (op) {
			case '**':
				return 4;
			case '*':
			case '/':
			case '%':
				return 3;
			case '+':
			case '-':
				return 2;
			case '<':
			case '>':
			case '<=':
			case '>=':
				return 1;
			default:
				return 0;
		}
	}

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

	private requireBracket() {
		const result = {
			left: false,
			right: false
		};
		const thisOpP = ConvertBinaryExpression.getOperatorPrecedence(this.expr.operator);
		if (this.expr.left.type === 'BinaryExpression') {
			result.left = thisOpP > ConvertBinaryExpression.getOperatorPrecedence(new ConvertBinaryExpression(this.expr.left).expr.operator);
		}
		if (this.expr.right.type === 'BinaryExpression') {
			result.right = thisOpP > ConvertBinaryExpression.getOperatorPrecedence(new ConvertBinaryExpression(this.expr.right).expr.operator);
		}

		return result;
	}

	private addBracketIfRequire(expr: string, isRequire: boolean) {
		return isRequire ? `(${expr})` : expr;
	}

	private toAiScript(left: string, right: string) {
		let op = this.expr.operator;
		if (op === '!==') {
			op = '!=';
		}
		else if (op === '===') {
			op = '==';
		}

		const bracket = this.requireBracket();

		switch (op) {
			case '**':
				return toMathPow(left, right);
			default:
				return `${this.addBracketIfRequire(left, bracket.left)}${optionalWhiteSpace()}${op}${optionalWhiteSpace()}${this.addBracketIfRequire(right, bracket.right)}`;
		}
	}

	public convert(): string {
		const left = convertExpressions(this.expr.left).convert();
		const right = convertExpressions(this.expr.right).convert();

		return this.toAiScript(left, right);
	}
}
