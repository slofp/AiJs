import { VariableDeclaration, VariableDeclarator } from 'acorn';
import { ConvertStatement } from './ConvertStatement';
import { convertExpressions } from '../../convert';
import { optionalWhiteSpace } from '../../utils/indent';
import { NotImplementError } from '../../expections/NotImplementError';

type Id = {
	type: 'Normal' | 'Arr' | 'Obj';
	name: string;
};

export class ConvertVariableDeclaration extends ConvertStatement<VariableDeclaration> {
	private isMut() {
		return this.state.kind === 'const';
	}

	private toAiscript(name: string, expr: string) {
		let result = this.isMut() ? 'let' : 'var';
		return result + ` ${name}${optionalWhiteSpace()}=${optionalWhiteSpace()}${expr}`;
	}

	private idConvert(id: VariableDeclarator['id']): Id {
		switch (id.type) {
			case 'Identifier':
				return {
					type: 'Normal',
					name: id.name,
				};
			default:
				throw new NotImplementError(`${id.type}は未実装です`, id.loc?.start, id.loc?.end);
		}
	}

	private convertDeclaration(): string[] {
		const results: string[] = [];

		for (const dec of this.state.declarations) {
			const id = this.idConvert(dec.id);

			// TODO: 分割代入のサポート
			if (dec.init === null || dec.init === undefined) {
				results.push(this.toAiscript(id.name, 'null'));
				continue;
			}

			results.push(this.toAiscript(id.name, convertExpressions(dec.init).convert()));
		}

		return results;
	}

	public convert(): string {
		const results = this.convertDeclaration();

		return results.join('\n');
	}
}
