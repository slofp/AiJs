import { Property } from "meriyah/dist/src/estree";
import { ConvertObjectLiteral } from "./ConvertObjectLiteral";
import { convertExpressions } from "../../convert";
import { CannotConvertError } from "../../expections/CannotConvertError";

export class ConvertProperty extends ConvertObjectLiteral<Property> {
	public convert(): string {
		if (this.ol.key.type !== 'Identifier') {
			throw new CannotConvertError('AiScript Obj key must be Identifier');
		}
		const key = convertExpressions(this.ol.key).convert();
		if (this.ol.value.type === 'AssignmentPattern') {
			throw new Error('AssignmentPattern is not implement.');
		}
		const value = convertExpressions(this.ol.value).convert();

		return `${key}: ${value}`;
	}
}
