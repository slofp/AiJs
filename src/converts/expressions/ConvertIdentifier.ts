import { Identifier } from 'acorn';
import { ConvertExpression } from './ConvertExpression';

export class ConvertIdentifier extends ConvertExpression<Identifier> {
	public convert(): string {
		return this.expr.name;
	}
}
