import { Expression, Property, PropertyDefinition } from 'acorn';
import { ConvertClass } from './ConvertClass';
import { IMakeNode } from './IMakeNode';
import { CannotConvertError } from '../../expections/CannotConvertError';
import { changeIfPrivateIdentifier } from './changeIdentifier';

export class ConvertPropertyDefinition extends ConvertClass<PropertyDefinition> implements IMakeNode<Expression> {
	public makeNode(): Expression {
		if (!this.classObj.value) {
			throw new CannotConvertError('初期化されていないため実装できません', this.classObj.loc?.start, this.classObj.loc?.end);
		}
		return this.classObj.value;
	}

	public makeProp(): Property {
		this.assertNewId(this.classObj.key);

		return {
			type: 'Property',
			start: this.classObj.start,
			end: this.classObj.end,
			loc: this.classObj.loc,
			method: false,
			shorthand: false,
			computed: false,
			kind: 'init',
			key: changeIfPrivateIdentifier(this.classObj.key),
			value: this.makeNode(),
		};
	}

	public convert(): string {
		throw new Error('Method not implemented.');
	}
}
