import { Expression } from "meriyah/dist/src/estree";
import { INode } from "../INode";

export abstract class ConvertExpression<T extends Expression> implements INode {
	constructor(protected expr: T) { }

	public abstract convert(): string;
}
