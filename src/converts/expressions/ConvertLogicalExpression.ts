import { LogicalExpression } from 'acorn';
import { ConvertExpression } from './ConvertExpression';
import { convertExpressions } from '../../convert';
import { optionalWhiteSpace } from '../../utils/indent';
import { CannotConvertError } from '../../expections/CannotConvertError';

const unsupportLogicalOperator: LogicalExpression['operator'][] = ['??'] as const;

export class ConvertLogicalExpression extends ConvertExpression<LogicalExpression> {
	public constructor(expr: LogicalExpression) {
		if (!unsupportLogicalOperator.some((v) => v === expr.operator)) {
			throw new CannotConvertError('使用できない演算子があります', expr.loc?.start, expr.loc?.end);
		}

		super(expr);
	}

	public convert(): string {
		const left = convertExpressions(this.expr.left).convert();
		const right = convertExpressions(this.expr.right).convert();

		return `${left}${optionalWhiteSpace()}${this.expr.operator}${optionalWhiteSpace()}${right}`;
	}
}
