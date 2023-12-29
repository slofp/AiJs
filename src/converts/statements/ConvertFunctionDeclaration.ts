import { FunctionDeclaration } from 'acorn';
import { ConvertStatement } from './ConvertStatement';
import { convertStatements } from '../../convert';
import { convertArgs, createFn } from '../../utils/func';

export class ConvertFunctionDeclaration extends ConvertStatement<FunctionDeclaration> {
	public convert(): string {
		const name = this.state.id.name;
		const args = convertArgs(this.state.params);
		const body = convertStatements(this.state.body, false).convert();

		return createFn(name, args, body);
	}
}
