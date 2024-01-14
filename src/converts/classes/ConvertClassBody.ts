import { ClassBody, FunctionExpression, MethodDefinition, Node, Pattern, Property } from "acorn";
import { ConvertClass } from "./ConvertClass";
import { INode } from "../INode";
import { UnsupportedClassObjectError } from "../../expections/UnsupportedClassObjectError";
import { ConvertMethodDefinition } from "./ConvertMethodDefinition";
import { ConvertPropertyDefinition } from "./ConvertPropertyDefinition";
import { NotImplementError } from "../../expections/NotImplementError";
import { ConvertVariableDeclaration } from "../statements/ConvertVariableDeclaration";
import { ConvertObjectExpression } from "../expressions/ConvertObjectExpression";
import { IMakeNode } from "./IMakeNode";
import { CannotConvertError } from "../../expections/CannotConvertError";


export class ConvertClassBody extends ConvertClass<ClassBody> {
	private methodConstructor?: MethodDefinition;

	private makeConstructor(instanceProps: IMakeNode<Node>[]): Property {
		let start = this.classObj.start;
		let end = this.classObj.end;
		let locale = this.classObj.loc;
		let fn: FunctionExpression | undefined;
		if (this.methodConstructor !== undefined) {
			start = this.methodConstructor.start;
			end = this.methodConstructor.end;
			locale = this.methodConstructor.loc;
			fn = this.methodConstructor.value;
		}
		if (fn === undefined) {
			fn = {
				type: 'FunctionExpression',
				start,
				end,
				loc: locale,
				id: null,
				expression: false,
				generator: false,
				async: false,
				params: [],
				body: {
					type: 'BlockStatement',
					start,
					end,
					loc: locale,
					body: [],
				},
			};
		}

		fn.body.body.unshift({
			type: 'VariableDeclaration',
			start: this.classObj.start,
			end: this.classObj.end,
			loc: this.classObj.loc,
			kind: 'const',
			declarations: [{
				type: 'VariableDeclarator',
				start: this.classObj.start,
				end: this.classObj.end,
				loc: this.classObj.loc,
				id: {
					type: 'Identifier',
					start: this.classObj.start,
					end: this.classObj.end,
					loc: this.classObj.loc,
					name: 'this',
				},
				init: {
					type: 'ObjectExpression',
					start: this.classObj.start,
					end: this.classObj.end,
					loc: this.classObj.loc,
					properties: instanceProps.map((v) => v.makeProp()),
				},
			}],
		});

		fn.body.body.push({
			type: 'ReturnStatement',
			start: this.classObj.start,
			end: this.classObj.end,
			loc: this.classObj.loc,
			argument: {
				type: 'Identifier',
				start: this.classObj.start,
				end: this.classObj.end,
				loc: this.classObj.loc,
				name: 'this',
			},
		});

		return {
			type: 'Property',
			start,
			end,
			loc: locale,
			method: true,
			shorthand: false,
			computed: false,
			kind: 'init',
			key: {
				type: 'Identifier',
				start,
				end,
				loc: locale,
				name: 'new',
			},
			value: fn,
		};
	}

	// boolean is true => isStatic
	// ただし、コンストラクタならtrue, 初期化子のないフィールドならfalseになる
	private makeClassProp(obj: ClassBody['body'][number]): [IMakeNode<Node> | undefined, boolean] {
		if (obj.type === 'StaticBlock') {
			throw new UnsupportedClassObjectError('Static blockは対応していません。', obj.loc?.start, obj.loc?.end);
		}

		if (obj.type === 'MethodDefinition') {
			if (obj.kind === 'constructor') {
				return [undefined, true];
			}
			if (obj.kind !== 'method') {
				throw new CannotConvertError('get/setは現在変換できません', obj.loc?.start, obj.loc?.end);
			}
			return [new ConvertMethodDefinition(obj), obj.static];
		}

		if (!obj.value) {
			return [undefined, false];
		}

		return [new ConvertPropertyDefinition(obj), obj.static];
	}

	public convert(): string {
		const instanceLevelConverts: IMakeNode<Node>[] = [];
		const staticLevelConverts: IMakeNode<Node>[] = [];
		for (const co of this.classObj.body) {
			const r = this.makeClassProp(co);
			if (r[0] === undefined) {
				if (r[1]) {
					this.methodConstructor = co as MethodDefinition;
				}
				continue;
			}
			if (r[1]) {
				staticLevelConverts.push(r[0]);
			}
			else {
				instanceLevelConverts.push(r[0]);
			}
		}

		return new ConvertObjectExpression({
			type: 'ObjectExpression',
			start: this.classObj.start,
			end: this.classObj.end,
			loc: this.classObj.loc,
			properties: [this.makeConstructor(instanceLevelConverts), ...staticLevelConverts.map((v) => v.makeProp())],
		}).convert();
	}
}
