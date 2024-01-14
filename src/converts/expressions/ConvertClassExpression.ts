import { ClassExpression } from "acorn";
import { ConvertExpression } from "./ConvertExpression";
import { CannotConvertError } from "../../expections/CannotConvertError";
import { ConvertClassBody } from "../classes/ConvertClassBody";

export class ConvertClassExpression extends ConvertExpression<ClassExpression> {
	public convert(): string {
		if (this.expr.superClass) {
			throw new CannotConvertError('継承は使用できません', this.expr.loc?.start, this.expr.loc?.end);
		}

		return new ConvertClassBody(this.expr.body).convert();
	}
}
