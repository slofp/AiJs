import { FunctionDeclaration } from "meriyah/dist/src/estree";
import { ConvertStatement } from "./ConvertStatement";
import { convertStatements } from "../../convert";
import { optionalWhiteSpace } from "../../utils/indent";

export class ConvertFunctionDeclaration extends ConvertStatement<FunctionDeclaration> {

	private convertArgs() {
		const result: string[] = [];
		for (const param of this.state.params) {
			// TODO: arg=default、[arg]、{arg}をサポートする
			if (param.type !== 'Identifier') {
				throw new Error('未実装の引数情報');
			}

			result.push(param.name);
		}

		return result;
	}

	private toAiScript(name: string, args: string[], body: string) {
		const arg = args.join(`,${optionalWhiteSpace()}`);
		return `@${name}(${arg})${optionalWhiteSpace()}${body}`
	}

	public convert(): string {
		if (this.state.id === null) {
			throw new Error('function state name is null');
		}
		if (!this.state.body) {
			throw new Error('function state body not found');
		}

		const name = this.state.id.name;
		const args = this.convertArgs();
		const body = convertStatements(this.state.body, false).convert();

		return this.toAiScript(name, args, body);
	}
}
