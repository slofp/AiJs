import { Statement } from 'acorn';
import { INode } from '../INode';

export abstract class ConvertStatement<T extends Statement> implements INode {
	constructor(protected state: T) {}

	public abstract convert(): string;
}
