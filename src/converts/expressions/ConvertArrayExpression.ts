import { ArrayExpression } from "meriyah/dist/src/estree";
import { ConvertExpression } from "./ConvertExpression";
import { convertExpressions } from "../../convert";
import { optionalWhiteSpace } from "../../utils/indent";

export class ConvertArrayExpression extends ConvertExpression<ArrayExpression> {
	private convertElements() {
		const results = [];
		for (const el of this.expr.elements) {
			if (el === null) {
				results.push('null');
			}
			else {
				results.push(convertExpressions(el).convert());
			}
		}

		return results;
	}

	public convert(): string {
		const elements = this.convertElements();
		return `[${elements.join(`,${optionalWhiteSpace()}`)}]`;
	}
}
