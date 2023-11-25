import { FunctionExpression } from "meriyah/dist/src/estree";
import { ConvertExpression } from "./ConvertExpression";
import { ConvertFunctionDeclaration } from "../statements/ConvertFunctionDeclaration";

export class ConvertFunctionExpression extends ConvertExpression<FunctionExpression> {
	public convert(): string {
		return new ConvertFunctionDeclaration({
			...this.expr,
			type: 'FunctionDeclaration',
		}).convert();
	}
}
