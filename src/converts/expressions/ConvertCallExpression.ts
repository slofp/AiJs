import { CallExpression } from 'meriyah/dist/src/estree';
import { ConvertExpression } from './ConvertExpression';
import { convertExpressions } from '../../convert';

export class ConvertCallExpression extends ConvertExpression<CallExpression> {

	private convertCallee(): string {
		// TODO: 通常変数以外も対応させる
		if (this.expr.callee.type !== 'Identifier') {
			throw new Error('未実装の関数呼出');
		}
		return this.expr.callee.name;
	}

	public convert(): string {
		const call = this.convertCallee();
		const args = this.expr.arguments.map(v => convertExpressions(v).convert()).join(', ');

		return `${call}(${args})`
	}
}
