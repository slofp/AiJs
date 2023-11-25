import { CallExpression } from 'meriyah/dist/src/estree';
import { ConvertExpression } from './ConvertExpression';
import { convertExpressions } from '../../convert';
import { optionalWhiteSpace } from '../../utils/indent';

export class ConvertCallExpression extends ConvertExpression<CallExpression> {

	private convertCallee(): string {
		// calleeには何が来るかわからないので順次どうにかする必要がある
		return convertExpressions(this.expr.callee).convert();
	}

	public convert(): string {
		const call = this.convertCallee();
		const args = this.expr.arguments.map(v => convertExpressions(v).convert());

		if (call === 'print' && args.length === 1) {
			return `<:${optionalWhiteSpace()}${args[0]}`;
		}
		else {
			return `${call}(${args.join(`,${optionalWhiteSpace()}`)})`;
		}
	}
}
