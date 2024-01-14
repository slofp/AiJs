import { Identifier, MemberExpression } from 'acorn';
import { ConvertExpression } from './ConvertExpression';
import { identifierStdName, uiNestIdentifierName } from '../../utils/stdLib';
import { convertExpressions } from '../../convert';
import { CannotConvertError } from '../../expections/CannotConvertError';
import { ConvertPrivateIdentifier } from '../others/ConvertPrivateIdentifier';

export class ConvertMemberExpression extends ConvertExpression<MemberExpression> {
	private checkStd() {
		if (this.expr.object.type === 'MemberExpression' && this.expr.object.property.type === 'Identifier') {
			if (new ConvertMemberExpression(this.expr.object).checkStd()) {
				const stdName = (this.expr.object.object as Identifier).name;
				if (stdName === 'Ui') {
					return uiNestIdentifierName(this.expr.object.property.name);
				}
			}
			return false;
		}
		return this.expr.object.type === 'Identifier' && identifierStdName(this.expr.object.name);
	}

	private convertProp() {
		if (this.expr.property.type === 'PrivateIdentifier') {
			return new ConvertPrivateIdentifier(this.expr.property).convert();
		}
		else {
			return convertExpressions(this.expr.property).convert();
		}
	}

	public convert(): string {
		if (this.expr.object.type === 'Super') {
			throw new CannotConvertError('superは使用できません', this.expr.object.loc?.start, this.expr.loc?.end);
		}
		const obj = convertExpressions(this.expr.object).convert();
		const prop = this.convertProp();

		if (this.expr.computed) {
			return `${obj}[${prop}]`;
		}

		if (this.checkStd()) {
			return `${obj}:${prop}`;
		}
		else {
			return `${obj}.${prop}`;
		}
	}
}
