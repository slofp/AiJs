import { AssignmentExpression } from 'acorn';
import { ConvertExpression } from './ConvertExpression';
import { convertExpressions, convertPatterns } from '../../convert';
import { UnsupportedOperatorError } from '../../expections/UnsupportedOperatorError';
import { toMathPow } from '../../utils/mathLib';
import { optionalWhiteSpace } from '../../utils/indent';

const unsupportedAssignOperator: readonly AssignmentExpression['operator'][] = ['&=', '|=', '^=', '<<=', '??=', '>>=', '>>>='] as const;

export class ConvertAssignmentExpression extends ConvertExpression<AssignmentExpression> {
	public constructor(expr: AssignmentExpression) {
		if (unsupportedAssignOperator.some((v) => v === expr.operator)) {
			throw new UnsupportedOperatorError(`${expr.operator}代入演算子は対応していません`, expr.loc?.start, expr.loc?.end);
		}
		super(expr);
	}

	private toAiScript(left: string, right: string) {
		switch (this.expr.operator) {
			case '**=':
				return `${left}${optionalWhiteSpace()}=${optionalWhiteSpace()}${toMathPow(left, right)}`;
			case '%=':
			case '&&=':
			case '*=':
			case '/=':
			case '||=':
				// TODO: 計算や比較を使用しないものは括弧をなくす
				return `${left}${optionalWhiteSpace()}=${optionalWhiteSpace()}${left}${optionalWhiteSpace()}${this.expr.operator.replace(
					'=',
					''
				)}${optionalWhiteSpace()}(${right})`;
			default:
				return `${left}${optionalWhiteSpace()}${this.expr.operator}${optionalWhiteSpace()}${right}`;
		}
	}

	public convert(): string {
		const left = convertPatterns(this.expr.left).convert();
		const right = convertExpressions(this.expr.right).convert();

		return this.toAiScript(left, right);
	}
}
