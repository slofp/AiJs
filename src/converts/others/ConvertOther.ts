import { Node } from 'acorn';
import { INode } from '../INode';

export abstract class ConvertOther<T extends Node> implements INode {
	constructor(protected node: T) {}

	public abstract convert(): string;
}
