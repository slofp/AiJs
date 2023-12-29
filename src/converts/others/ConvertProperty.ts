import { Property } from 'acorn';
import { convertExpressions } from '../../convert';
import { CannotConvertError } from '../../expections/CannotConvertError';
import { ConvertOther } from './ConvertOther';

export class ConvertProperty extends ConvertOther<Property> {
	public convert(): string {
		if (this.node.key.type !== 'Identifier') {
			throw new CannotConvertError('AiScriptのObj型で使用するkeyはIdentifierでなければいけません', this.node.key.loc?.start, this.node.key.loc?.end);
		}
		const key = convertExpressions(this.node.key).convert();
		const value = convertExpressions(this.node.value).convert();

		return `${key}: ${value}`;
	}
}
