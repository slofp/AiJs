import { FunctionExpression, Identifier } from 'acorn';
import { ConvertExpression } from './ConvertExpression';
import { ConvertFunctionDeclaration } from '../statements/ConvertFunctionDeclaration';

export class ConvertFunctionExpression extends ConvertExpression<FunctionExpression> {
	public convert(): string {
		const id: Identifier =
			this.expr.id === null || this.expr.id === undefined
				? {
						...this.expr,
						type: 'Identifier',
						name: '',
					}
				: this.expr.id;
		return new ConvertFunctionDeclaration({
			...this.expr,
			type: 'FunctionDeclaration',
			id,
		}).convert();
	}
}
