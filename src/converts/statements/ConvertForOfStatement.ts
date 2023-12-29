import { ForOfStatement } from 'acorn';
import { ConvertStatement } from './ConvertStatement';
import { UnsupportedExpressionError } from '../../expections/UnsupportedExpressionError';
import { CannotConvertError } from '../../expections/CannotConvertError';
import { convertExpressions, convertPatterns, convertStatements } from '../../convert';
import { optionalWhiteSpace } from '../../utils/indent';

export class ConvertForOfStatement extends ConvertStatement<ForOfStatement> {
	public convert(): string {
		if (this.state.left.type !== 'VariableDeclaration') {
			throw new UnsupportedExpressionError(
				'each文に変換するため変数宣言以外には対応していません',
				this.state.left.loc?.start,
				this.state.left.loc?.end
			);
		}
		else if (this.state.left.kind !== 'const') {
			throw new CannotConvertError('const以外は受け付けません', this.state.left.loc?.start, this.state.left.loc?.end);
		}
		// for-ofの変数宣言は変数が1つしか受け付けないので気にしなくて良い
		const id = this.state.left.declarations[0].id;
		const left = `let ${convertPatterns(id).convert()}`;
		const right = convertExpressions(this.state.right).convert();
		const body = convertStatements(this.state.body, false).convert();

		return `each${optionalWhiteSpace()}(${left},${optionalWhiteSpace()}${right})${optionalWhiteSpace()}${body}`;
	}
}
