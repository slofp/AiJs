import { ArrayExpression } from 'acorn';
import { ConvertExpression } from './ConvertExpression';
import { convertExpressions } from '../../convert';
import { optionalWhiteSpace } from '../../utils/indent';
import { NotImplementError } from '../../expections/NotImplementError';

export class ConvertArrayExpression extends ConvertExpression<ArrayExpression> {
	private convertElements() {
		const results = [];
		for (const el of this.expr.elements) {
			if (el === null) {
				results.push('null');
			}
			else if (el.type === 'SpreadElement') {
				throw new NotImplementError('スプレッド構文は未対応です', el.loc?.start, el.loc?.end);
			}
			else {
				results.push(convertExpressions(el).convert());
			}
		}

		return results;
	}

	public convert(): string {
		const elements = this.convertElements();
		return `[${elements.join(`,${optionalWhiteSpace()}`)}]`;
	}
}
