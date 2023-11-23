import { ReturnStatement } from "meriyah/dist/src/estree";
import { ConvertStatement } from "./ConvertStatement";
import { convertExpressions } from '../../convert';

export class ConvertReturnStatement extends ConvertStatement<ReturnStatement> {
	private toAiScript(expr: string) {
		return `return ${expr}`;
	}

	public convert(): string {
		if (this.state.argument === null) return this.toAiScript('');
		return this.toAiScript(convertExpressions(this.state.argument).convert());
	}
}
