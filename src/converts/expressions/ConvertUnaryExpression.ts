import { UnaryExpression } from "acorn";
import { ConvertExpression } from "./ConvertExpression";
import { convertExpressions } from "../../convert";
import { UnsupportedOperatorError } from '../../expections/UnsupportedOperatorError';
import { CannotConvertError } from "../../expections/CannotConvertError";

export class ConvertUnaryExpression extends ConvertExpression<UnaryExpression> {
	public convert(): string {
		if (this.expr.operator === '!') {
			return `!${convertExpressions(this.expr.argument).convert()}`;
		}
		if (this.expr.operator === '+' || this.expr.operator === '-') {
			if (this.expr.argument.type === 'Literal' && typeof this.expr.argument.value === 'number') {
				return `${this.expr.operator}${convertExpressions(this.expr.argument).convert()}`;
			}

			throw new CannotConvertError('単項の+または-はnumber以外の要素を含むことはできません', this.expr.argument.loc?.start, this.expr.argument.loc?.end);
		}

		throw new UnsupportedOperatorError(`${this.expr.operator}はサポートされません`, this.expr.loc?.start, this.expr.loc?.end);
	}
}