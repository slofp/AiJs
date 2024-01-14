import { ClassBody, MethodDefinition, StaticBlock, PropertyDefinition, Expression, PrivateIdentifier } from 'acorn';
import { INode } from '../INode';
import { CannotConvertError } from '../../expections/CannotConvertError';

export abstract class ConvertClass<T extends ClassBody | MethodDefinition | PropertyDefinition | StaticBlock> implements INode {
	constructor(protected classObj: T) {}

	protected assertNewId(id: Expression | PrivateIdentifier): void {
		if (id.type === 'Identifier' && id.name === 'new') {
			throw new CannotConvertError('フィールドまたはメソッド名にnewをつけることはできません', id.loc?.start, id.loc?.end);
		}
	}

	public abstract convert(): string;
}
