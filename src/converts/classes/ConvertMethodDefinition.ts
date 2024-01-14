import { FunctionExpression, MethodDefinition, Property } from 'acorn';
import { ConvertClass } from './ConvertClass';
import { IMakeNode } from './IMakeNode';
import { changeIfPrivateIdentifier } from './changeIdentifier';

export class ConvertMethodDefinition extends ConvertClass<MethodDefinition> implements IMakeNode<FunctionExpression> {
	public makeNode(): FunctionExpression {
		return this.classObj.value;
	}

	public makeProp(): Property {
		this.assertNewId(this.classObj.key);

		return {
			type: 'Property',
			start: this.classObj.start,
			end: this.classObj.end,
			loc: this.classObj.loc,
			method: true,
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
