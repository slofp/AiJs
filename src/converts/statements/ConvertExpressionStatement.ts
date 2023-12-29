import { ExpressionStatement } from 'acorn';
import { ConvertStatement } from './ConvertStatement';
import { convertExpressions } from '../../convert';

export class ConvertExpressionStatement extends ConvertStatement<ExpressionStatement> {
	public convert(): string {
		return convertExpressions(this.state.expression, true).convert();
	}
}
