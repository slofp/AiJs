import { IfStatement, Statement } from 'acorn';
import { ConvertStatement } from './ConvertStatement';
import { convertExpressions, convertStatements } from '../../convert';
import { insertNewLine, optionalWhiteSpace } from '../../utils/indent';
import { INode } from '../INode';

export class ConvertIfStatement extends ConvertStatement<IfStatement> {
	public constructor(
		state: IfStatement,
		private isElif: boolean = false
	) {
		super(state);
	}

	private static checkElif(state: Statement): state is IfStatement {
		return state.type === 'IfStatement';
	}

	private toAiScript(test: string, then: string, alterIsElif: boolean, alter?: string): string {
		let result = this.isElif ? `elif${optionalWhiteSpace()}` : 'if ';
		result += `(${test})${this.isElif ? optionalWhiteSpace() : ' '}`;
		result += then;
		if (alter) {
			result += insertNewLine ? '\n' : ' ';
			if (!alterIsElif) {
				result += 'else';
				if (this.state.alternate!.type === 'BlockStatement') {
					result += optionalWhiteSpace();
				}
				else {
					result += ' ';
				}
			}
			result += alter;
		}

		return result;
	}

	public convert(): string {
		const test = convertExpressions(this.state.test).convert();
		const then = convertStatements(this.state.consequent, false).convert();
		let alter: INode | null = null;
		let alterIsElif = false;
		if (this.state.alternate !== null && this.state.alternate !== undefined) {
			if ((alterIsElif = ConvertIfStatement.checkElif(this.state.alternate))) {
				alter = new ConvertIfStatement(this.state.alternate, true);
			}
			else {
				alter = convertStatements(this.state.alternate, false);
			}
		}
		return this.toAiScript(test, then, alterIsElif, alter?.convert());
	}
}
