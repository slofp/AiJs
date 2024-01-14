import { ThisExpression } from 'acorn';
import { ConvertExpression } from './ConvertExpression';

export class ConvertThisExpression extends ConvertExpression<ThisExpression> {
	public convert(): string {
		return 'this';
	}
}
