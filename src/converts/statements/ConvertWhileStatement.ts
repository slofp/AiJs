import { WhileStatement } from 'acorn';
import { ConvertStatement } from './ConvertStatement';
import { convertExpressions, convertStatements } from '../../convert';
import { nestIndents, optionalNewLine, optionalWhiteSpace } from '../../utils/indent';

export class ConvertWhileStatement extends ConvertStatement<WhileStatement> {
	private toAiScript(test: string, body: string, isPure: boolean): string {
		let result = `loop${optionalWhiteSpace()}{${optionalNewLine()}`;
		const loopState = [];
		if (!isPure) {
			loopState.push(`if (!(${test})) break`);
		}
		loopState.push(body);
		return result + nestIndents(loopState.join('\n')) + `${optionalNewLine()}}`;
	}

	public convert(): string {
		const isPureLoop = this.state.test.type === 'Literal' && this.state.test.value === true;
		const test = convertExpressions(this.state.test).convert();
		const isNotNest = isPureLoop && this.state.body.type === 'BlockStatement';
		const body = convertStatements(this.state.body, !isPureLoop).convert();

		if (isNotNest) {
			return `loop${optionalWhiteSpace()}${body}`;
		}

		return this.toAiScript(test, body, isPureLoop);
	}
}
