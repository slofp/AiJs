import { CallExpression } from 'acorn';
import { ConvertExpression } from './ConvertExpression';
import { convertExpressions } from '../../convert';
import { optionalWhiteSpace } from '../../utils/indent';
import { CannotConvertError } from '../../expections/CannotConvertError';
import { NotImplementError } from '../../expections/NotImplementError';

export class ConvertCallExpression extends ConvertExpression<CallExpression> {
	private convertCallee(): string {
		// calleeには何が来るかわからないので順次どうにかする必要がある
		if (this.expr.callee.type === 'Super') {
			throw new CannotConvertError('superを呼び出すことはできません', this.expr.callee.loc?.start, this.expr.callee.loc?.end);
		}
		return convertExpressions(this.expr.callee).convert();
	}

	public convert(): string {
		const call = this.convertCallee();
		const args = this.expr.arguments.map((v) => {
			if (v.type === 'SpreadElement') {
				throw new NotImplementError('スプレッド構文は未対応です', v.loc?.start, v.loc?.end);
			}
			return convertExpressions(v).convert();
		});

		if (call === 'print' && args.length === 1) {
			return `<:${optionalWhiteSpace()}${args[0]}`;
		}
		else {
			return `${call}(${args.join(`,${optionalWhiteSpace()}`)})`;
		}
	}
}
