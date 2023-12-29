import { ParenthesizedExpression } from 'acorn';
import { ConvertExpression } from './ConvertExpression';
import { convertExpressions } from '../../convert';

export class ConvertParenthesizedExpression extends ConvertExpression<ParenthesizedExpression> {
	public convert(): string {
		return `(${convertExpressions(this.expr.expression).convert()})`;
	}
}
