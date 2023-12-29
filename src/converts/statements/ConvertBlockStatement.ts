import { BlockStatement } from 'acorn';
import { ConvertStatement } from './ConvertStatement';
import { convertStatements } from '../../convert';
import { generateIndents, optionalNewLine, optionalWhiteSpace } from '../../utils/indent';
import { INode } from '../INode';

export class ConvertBlockStatement extends ConvertStatement<BlockStatement> {
	private isEval: boolean;

	public constructor(state: BlockStatement, isEval: boolean) {
		super(state);
		this.isEval = isEval;
	}

	public convert(): string {
		const result: INode[] = [];
		for (const state of this.state.body) {
			result.push(convertStatements(state));
		}

		const resultText = `{${optionalNewLine()}${result
			.map(
				(v) =>
					generateIndents() +
					v
						.convert()
						.split('\n')
						.join('\n' + generateIndents())
			)
			.join('\n')}${optionalNewLine()}}`;
		if (this.isEval) {
			return `eval${optionalWhiteSpace()}${resultText}`;
		}
		else {
			return resultText;
		}
	}
}
