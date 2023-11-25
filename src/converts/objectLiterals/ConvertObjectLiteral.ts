import { ObjectLiteralElementLike } from "meriyah/dist/src/estree";
import { INode } from "../INode";

export abstract class ConvertObjectLiteral<T extends ObjectLiteralElementLike> implements INode {
	constructor(protected ol: T) { }

	public abstract convert(): string;
}
