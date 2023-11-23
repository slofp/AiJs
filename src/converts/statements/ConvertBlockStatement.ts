import { BlockStatement } from "meriyah/dist/src/estree";
import { ConvertStatement } from './ConvertStatement';
import { convertStatements } from "../../convert";
import { generateIndents } from "../../utils/indent";

export class ConvertBlockStatement extends ConvertStatement<BlockStatement> {

	private isEval: boolean;

	public constructor(state: BlockStatement, isEval: boolean) {
		super(state);
		this.isEval = isEval;
	}

	public convert(): string {
		const result: ConvertStatement<any>[] = [];
		for (const state of this.state.body) {
			result.push(convertStatements(state));
		}

		const resultText = `{\n${result.map(v => generateIndents() + v.convert().split('\n').join('\n' + generateIndents())).join('\n')}\n}`;
		if (this.isEval) {
			return `eval ${resultText}`;
		}
		else {
			return resultText;
		}
	}
}
