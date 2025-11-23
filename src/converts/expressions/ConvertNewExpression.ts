import { NewExpression } from 'acorn';
import { ConvertExpression } from './ConvertExpression';
import { ConvertCallExpression } from './ConvertCallExpression';

export class ConvertNewExpression extends ConvertExpression<NewExpression> {
	public convert(): string {
		return new ConvertCallExpression({
			...this.expr,
			type: 'CallExpression',
			optional: false,
			callee: {
				...this.expr.callee,
				type: 'MemberExpression',
				object: this.expr.callee,
				property: {
					...this.expr.callee,
					type: 'Identifier',
					name: '__new__',
				},
				computed: false,
				optional: false,
			},
		}).convert();
	}
}
