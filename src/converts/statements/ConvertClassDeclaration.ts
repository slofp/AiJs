import { ClassDeclaration } from "acorn";
import { ConvertStatement } from "./ConvertStatement";
import { convertExpressions } from "../../convert";
import { ConvertClassBody } from "../classes/ConvertClassBody";
import { optionalWhiteSpace } from "../../utils/indent";
import { CannotConvertError } from "../../expections/CannotConvertError";

export class ConvertClassDeclaration extends ConvertStatement<ClassDeclaration> {
	public convert(): string {
		if (this.state.superClass) {
			throw new CannotConvertError('継承は使用できません', this.state.loc?.start, this.state.loc?.end);
		}

		const name = convertExpressions(this.state.id);
		const value = new ConvertClassBody(this.state.body);

		return `let ${name.convert()}${optionalWhiteSpace()}=${optionalWhiteSpace()}${value.convert()}`;
	}
}
