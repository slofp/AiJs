import { Expression, PrivateIdentifier } from 'acorn';
import { ConvertPrivateIdentifier } from '../others/ConvertPrivateIdentifier';

export function changeIfPrivateIdentifier(node: Expression | PrivateIdentifier): Expression {
	if (node.type !== 'PrivateIdentifier') {
		return node;
	}

	return {
		type: 'Identifier',
		start: node.start,
		end: node.end,
		loc: node.loc,
		name: new ConvertPrivateIdentifier(node).convert(),
	};
}
