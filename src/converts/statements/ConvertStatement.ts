import { Statement } from "meriyah/dist/src/estree";
import { INode } from "../INode";

export abstract class ConvertStatement<T extends Statement> implements INode {
	constructor(protected state: T) { }

	public abstract convert(): string;
}
