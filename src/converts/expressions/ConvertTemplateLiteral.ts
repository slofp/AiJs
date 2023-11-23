import { TemplateLiteral } from 'meriyah/dist/src/estree';
import { ConvertExpression } from './ConvertExpression';
import { strLf } from '../../utils/newline';
import { convertExpressions } from '../../convert';

export class ConvertTemplateLiteral extends ConvertExpression<TemplateLiteral> {
	private convertElement(): string[] {
		const result: string[] = [];

		for (const el of this.expr.quasis) {
			result.push((el.value.cooked ?? '').replaceAll('\n', `{${strLf}}`));
		}

		return result;
	}

	private convertExpr(): string[] {
		const result: string[] = [];

		for (const expr of this.expr.expressions) {
			result.push(convertExpressions(expr).convert());
		}

		return result;
	}

	private toAiScript(elements: string[], expressions: string[]) {
		let result = '';
		const totalLength = elements.length + expressions.length;

		for (let i = 0; i < totalLength; i++) {
			const index = Math.floor(i / 2);
			if (i % 2 === 0) {
				result += elements[index];
			}
			else {
				result += `{${expressions[index]}}`;
			}
		}

		return `\`${result}\``;
	}

	public convert(): string {
		const elements = this.convertElement();
		const expressions = this.convertExpr();

		return this.toAiScript(elements, expressions);
	}
}
