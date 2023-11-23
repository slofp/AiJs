import { Literal } from "meriyah/dist/src/estree";
import { ConvertExpression } from "./ConvertExpression";
import { UnsupportedLiteralTypeError } from "../../expections/UnsupportedLiteralTypeError";

const unSupportedType = [
	'RegExp'
] as const;

export class ConvertLiteral extends ConvertExpression<Literal> {

	private isUnsupportedType() {
		const tr = typeof this.expr.value;
		const t = tr === 'object' ? this.expr.value instanceof RegExp ? 'RegExp' : this.expr.value === null ? 'null' : tr : tr;
		return unSupportedType.some(v => v === t);
	}

	public convert(): string {
		if (this.isUnsupportedType()) {
			throw new UnsupportedLiteralTypeError();
		}

		if (this.expr.value === null) return 'null';
		if (typeof this.expr.value === 'string') {
			return `'${this.expr.value}'`;
		}

		return this.expr.value.toString();
	}
}
