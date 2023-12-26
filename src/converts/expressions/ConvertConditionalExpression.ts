import { ConditionalExpression } from "meriyah/dist/src/estree";
import { ConvertExpression } from "./ConvertExpression";
import { optionalWhiteSpace } from "../../utils/indent";
import { convertExpressions } from "../../convert";

export class ConvertConditionalExpression extends ConvertExpression<ConditionalExpression> {

	public constructor(expr: ConditionalExpression, private isAlternateCondition = false) {
		super(expr);
	}

	private toAiScript(test: string, then: string, alter: string, nextEnd: boolean) {
		let res = '';
		let optionRequireWhiteSpace =  this.isAlternateCondition ? optionalWhiteSpace() : ' ';
		if (this.isAlternateCondition) {
			res += 'elif';
		}
		else {
			res += 'if';
		}
		res += `${optionRequireWhiteSpace}(${test})${optionRequireWhiteSpace}{${optionalWhiteSpace()}${then}${optionalWhiteSpace()}} `;
		if (nextEnd) {
			res += `else${optionalWhiteSpace()}{${optionalWhiteSpace()}${alter}${optionalWhiteSpace()}}`;
		}
		else {
			res += alter;
		}
		return res;
	}

	public convert(): string {
		const test = convertExpressions(this.expr.test);
		const then = convertExpressions(this.expr.consequent);
		const isElif = this.expr.alternate.type === 'ConditionalExpression';
		const alter =
			isElif ?
				new ConvertConditionalExpression(this.expr.alternate as ConditionalExpression)
				:
				convertExpressions(this.expr.alternate);

		return this.toAiScript(test.convert(), then.convert(), alter.convert(), !isElif);
	}
}
