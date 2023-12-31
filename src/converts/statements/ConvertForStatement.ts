import { ForStatement } from 'acorn';
import { ConvertStatement } from './ConvertStatement';
import { existsVariable } from '../../utils/exists';
import { convertExpressions, convertStatements } from '../../convert';
import { INode } from '../INode';
import { nestIndents, optionalNewLine, optionalWhiteSpace } from '../../utils/indent';

export class ConvertForStatement extends ConvertStatement<ForStatement> {
	private checkUsingCounter(name: string) {
		return existsVariable(this.state.body, name);
	}

	private checkUpdateCounter(name: string) {
		if (this.state.update === null || this.state.update === undefined) {
			return false;
		}
		if (
			this.state.update.type === 'UpdateExpression' &&
			!this.state.update.prefix &&
			this.state.update.operator === '++' &&
			this.state.update.argument.type === 'Identifier' &&
			this.state.update.argument.name === name
		) {
			return true;
		}
		else if (
			this.state.update.type === 'AssignmentExpression' &&
			this.state.update.operator === '+=' &&
			this.state.update.left.type === 'Identifier' &&
			this.state.update.right.type === 'Literal' &&
			this.state.update.right.value === 1 &&
			this.state.update.left.name === name
		) {
			return true;
		}

		return false;
	}

	private checkInitCounter(): { check: boolean; name?: string } {
		if (
			this.state.init !== null &&
			this.state.init !== undefined &&
			this.state.init.type === 'VariableDeclaration' &&
			this.state.init.declarations.length === 1 &&
			this.state.init.declarations[0].init !== null &&
			this.state.init.declarations[0].init !== undefined &&
			this.state.init.declarations[0].init.type === 'Literal' &&
			this.state.init.declarations[0].init.value === 0 &&
			this.state.init.declarations[0].id.type === 'Identifier'
		) {
			return {
				check: true,
				name: this.state.init.declarations[0].id.name,
			};
		}

		return { check: false };
	}

	private checkTestCounter(name: string): { check: boolean; value?: string } {
		if (this.state.test !== null && this.state.test !== undefined && this.state.test.type === 'BinaryExpression') {
			if (this.state.test.left.type === 'Identifier' && this.state.test.operator === '<') {
				return {
					check: this.state.test.left.name === name,
					value: convertExpressions(this.state.test.right).convert(),
				};
			}
			else if (this.state.test.operator === '>' && this.state.test.right.type === 'Identifier') {
				return {
					check: this.state.test.right.name === name,
					value: convertExpressions(this.state.test.left).convert(),
				};
			}
		}

		return { check: false };
	}

	private toAiScriptFor(name: string, count: string, isUsing: boolean, state: string): string {
		if (isUsing) {
			return `for${optionalWhiteSpace()}(let ${name},${optionalWhiteSpace()}${count})${optionalWhiteSpace()}${state}`;
		}
		else {
			return `for${optionalWhiteSpace()}(${count})${optionalWhiteSpace()}${state}`;
		}
	}

	private toAiScriptLoop(init: INode | null, test: string, state: string, update: INode | null): string {
		let result = `eval${optionalWhiteSpace()}{${optionalNewLine()}`;
		if (init !== null) {
			result += nestIndents(init.convert()) + '\n';
		}
		const loop = [`if (${test}) ${state}`, 'else break'];
		if (update !== null) {
			loop.push(update.convert());
		}

		result += nestIndents([`loop${optionalWhiteSpace()}{`, nestIndents(loop.join('\n')), '}'].join(optionalNewLine()));
		return result + `${optionalNewLine()}}`;
	}

	private convertLoop(): string {
		const init: INode | null = this.state.init
			? this.state.init.type === 'VariableDeclaration'
				? convertStatements(this.state.init)
				: convertExpressions(this.state.init, true)
			: null;
		const test = this.state.test ? convertExpressions(this.state.test, true).convert() : 'true';
		const loopState = convertStatements(this.state.body, false).convert();
		const update: INode | null = this.state.update ? convertExpressions(this.state.update, true) : null;

		return this.toAiScriptLoop(init, test, loopState, update);
	}

	public convert(): string {
		const initCheck = this.checkInitCounter();
		if (!initCheck.check) {
			return this.convertLoop();
		}
		const name = initCheck.name!;

		const testCheck = this.checkTestCounter(name);
		if (!testCheck.check) {
			return this.convertLoop();
		}
		const value = testCheck.value!;

		if (!this.checkUpdateCounter(name)) {
			return this.convertLoop();
		}

		return this.toAiScriptFor(name, value, this.checkUsingCounter(name), convertStatements(this.state.body, false).convert());
	}
}
