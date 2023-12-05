import { BreakStatement } from "meriyah/dist/src/estree";
import { ConvertStatement } from "./ConvertStatement";
import { CannotConvertError } from "../../expections/CannotConvertError";

export class ConvertBreakStatement extends ConvertStatement<BreakStatement> {
	public convert(): string {
		if (this.state.label !== null) {
			throw new CannotConvertError('ラベル付きbreakは対応していません');
		}
		return 'break';
	}
}
