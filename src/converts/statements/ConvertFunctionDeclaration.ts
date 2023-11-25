import { FunctionDeclaration } from "meriyah/dist/src/estree";
import { ConvertStatement } from "./ConvertStatement";
import { convertStatements } from "../../convert";
import { optionalWhiteSpace } from "../../utils/indent";
import { convertArgs, createFn } from "../../utils/func";

export class ConvertFunctionDeclaration extends ConvertStatement<FunctionDeclaration> {
	public convert(): string {
		if (!this.state.body) {
			throw new Error('function state body not found');
		}

		const name = this.state.id?.name ?? '';
		const args = convertArgs(this.state.params);
		const body = convertStatements(this.state.body, false).convert();

		return createFn(name, args, body);
	}
}
