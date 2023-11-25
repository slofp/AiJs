import { UpdateExpression } from "meriyah/dist/src/estree";
import { ConvertExpression } from "./ConvertExpression";
import { convertExpressions } from "../../convert";
import { nestIndents, optionalNewLine, optionalWhiteSpace } from './../../utils/indent';

export class ConvertUpdateExpression extends ConvertExpression<UpdateExpression> {

	public constructor(expr: UpdateExpression, private isState: boolean) {
		super(expr);
	}

	private getOperator() {
		if (this.expr.operator === '++') {
			return '+=';
		}
		else {
			return '-=';
		}
	}

	private isPost() {
		return !this.expr.prefix;
	}

	private toAiScriptEval(arg: string): string {
		let result = `eval${optionalWhiteSpace()}{${optionalNewLine()}`;
		let evalCode = '';
		if (!this.isPost()) {
			evalCode += `var _${optionalWhiteSpace()}=${optionalWhiteSpace()}${arg}\n`;
		}
		evalCode += `${arg}${optionalWhiteSpace()}${this.getOperator()}${optionalWhiteSpace()}1\n`;
		evalCode += this.isPost() ? arg : '_';
		result += nestIndents(evalCode);
		return `${result}${optionalNewLine()}}`;
	}

	public convert(): string {
		const arg = convertExpressions(this.expr.argument).convert();

		if (this.isState) {
			return `${arg}${optionalWhiteSpace()}${this.getOperator()}${optionalWhiteSpace()}1`;
		}
		return this.toAiScriptEval(arg);
	}
}
