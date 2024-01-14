import { Property, Node } from 'acorn';

export interface IMakeNode<T extends Node> {
	makeProp(): Property;
	makeNode(): T;
}
