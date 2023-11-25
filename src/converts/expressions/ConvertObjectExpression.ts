import { ObjectExpression } from "meriyah/dist/src/estree";
import { ConvertExpression } from "./ConvertExpression";
import { ConvertProperty } from "../objectLiterals/ConvertProperty";
import { nestIndents, optionalNewLine } from "../../utils/indent";

export class ConvertObjectExpression extends ConvertExpression<ObjectExpression> {

	public convertObjectLiterals() {
		const results = [];

		for (const ol of this.expr.properties) {
			switch (ol.type) {
				case 'Property':
					results.push(new ConvertProperty(ol));
					break;
				default:
					throw new Error(`${ol.type}は未実装です`);
			}
		}

		return results.map(v => v.convert()).join(`,${optionalNewLine()}`);
	}

	public convert(): string {
		const objectLiterals = nestIndents(this.convertObjectLiterals());
		return `{${optionalNewLine()}${objectLiterals}${optionalNewLine()}}`;
	}
}
