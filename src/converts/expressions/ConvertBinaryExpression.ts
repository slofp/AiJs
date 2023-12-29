import { BinaryExpression } from 'acorn';
import { ConvertExpression } from './ConvertExpression';
import { UnsupportedOperatorError } from '../../expections/UnsupportedOperatorError';
import { convertExpressions } from '../../convert';
import { toMathPow } from '../../utils/mathLib';
import { optionalWhiteSpace } from '../../utils/indent';

// && と || と ?? は Binaryではない
const unsupportedBinaryOperator: readonly BinaryExpression['operator'][] = ['&', '|', '^', '<<', '>>', '>>>', 'in', 'instanceof'] as const;

export class ConvertBinaryExpression extends ConvertExpression<BinaryExpression> {
	public constructor(expr: BinaryExpression) {
		if (unsupportedBinaryOperator.some((v) => v === expr.operator)) {
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
				return `${left}${optionalWhiteSpace()}${op}${optionalWhiteSpace()}${right}`;
		}
	}

	public convert(): string {
		const left = convertExpressions(this.expr.left).convert();
		const right = convertExpressions(this.expr.right).convert();

		return this.toAiScript(left, right);
	}
}
