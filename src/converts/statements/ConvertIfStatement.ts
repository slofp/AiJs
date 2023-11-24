import { IfStatement, Statement } from "meriyah/dist/src/estree";
import { ConvertStatement } from "./ConvertStatement";
import { convertExpressions, convertStatements } from "../../convert";

export class ConvertIfStatement extends ConvertStatement<IfStatement> {

	public constructor(state: IfStatement, private isElif: boolean = false) {
		super(state);
	}

	private static checkElif(state: Statement): state is IfStatement {
		return state.type === 'IfStatement';
	}

	private toAiScript(test: string, then: string, alterIsElif: boolean, alter?: string): string {
		let result = this.isElif ? 'elif' : 'if';
		result += ` (${test}) `;
		result += then;
		if (alter) {
			result += '\n';
			if (!alterIsElif) {
				result += 'else ';
			}
			result += alter;
		}

		return result;
	}

	public convert(): string {
		const test = convertExpressions(this.state.test).convert();
		const then = convertStatements(this.state.consequent, false).convert();
		let alter: ConvertStatement<any> | null = null;
		let alterIsElif = false;
		if (this.state.alternate !== null) {
			if (alterIsElif = ConvertIfStatement.checkElif(this.state.alternate)) {
				alter = new ConvertIfStatement(this.state.alternate, true);
			}
			else {
				alter = convertStatements(this.state.alternate, false);
			}
		}
		return this.toAiScript(test, then, alterIsElif, alter?.convert());
	}
}
