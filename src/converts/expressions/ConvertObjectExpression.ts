import { ObjectExpression } from 'acorn';
import { ConvertExpression } from './ConvertExpression';
import { nestIndents, optionalNewLine } from '../../utils/indent';
import { NotImplementError } from '../../expections/NotImplementError';
import { ConvertProperty } from '../others/ConvertProperty';

export class ConvertObjectExpression extends ConvertExpression<ObjectExpression> {
	public convertObjectLiterals() {
		const results = [];

		for (const ol of this.expr.properties) {
			switch (ol.type) {
				case 'Property':
					results.push(new ConvertProperty(ol));
					break;
				default:
					throw new NotImplementError(`${ol.type}は未実装です`, this.expr.loc?.start, this.expr.loc?.end);
			}
		}

		return results.map((v) => v.convert()).join(`,${optionalNewLine()}`);
	}

	public convert(): string {
		const objectLiterals = nestIndents(this.convertObjectLiterals());
		return `{${optionalNewLine()}${objectLiterals}${optionalNewLine()}}`;
	}
}
