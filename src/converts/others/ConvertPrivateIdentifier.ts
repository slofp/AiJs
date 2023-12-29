import { PrivateIdentifier } from 'acorn';
import { ConvertOther } from './ConvertOther';

export class ConvertPrivateIdentifier extends ConvertOther<PrivateIdentifier> {
	public convert(): string {
		return `__${this.node.name}`;
	}
}
