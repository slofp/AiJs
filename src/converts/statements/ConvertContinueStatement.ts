import { ContinueStatement } from 'acorn';
import { ConvertStatement } from './ConvertStatement';
import { CannotConvertError } from '../../expections/CannotConvertError';

export class ConvertContinueStatement extends ConvertStatement<ContinueStatement> {
	public convert(): string {
		if (this.state.label !== null) {
			throw new CannotConvertError('ラベル付きcontinueは対応していません');
		}
		return 'continue';
	}
}
