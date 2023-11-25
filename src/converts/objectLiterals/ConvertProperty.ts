import { Property } from "meriyah/dist/src/estree";
import { ConvertObjectLiteral } from "./ConvertObjectLiteral";
import { convertExpressions } from "../../convert";

export class ConvertProperty extends ConvertObjectLiteral<Property> {
	public convert(): string {
		const key = convertExpressions(this.ol.key).convert();
		if (this.ol.value.type === 'AssignmentPattern') {
			throw new Error('AssignmentPattern is not implement.');
		}
		const value = convertExpressions(this.ol.value).convert();

		return `${key}: ${value}`;
	}
}
