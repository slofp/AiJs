import { VariableDeclaration, VariableDeclarator } from "meriyah/dist/src/estree";
import { ConvertStatement } from "./ConvertStatement";
import { convertExpressions } from "../../convert";

type Id = {
	type: "Normal" | "Arr" | "Obj";
	name: string;
};

export class ConvertVariableDeclaration extends ConvertStatement<VariableDeclaration> {
	private isMut() {
		return this.state.kind === "const";
	}

	private toAiscript(name: string, expr: string) {
		if (this.isMut()) {
			return `let ${name} = ${expr}`;
		} else {
			return `var ${name} = ${expr}`;
		}
	}

	private idConvert(id: VariableDeclarator["id"]): Id {
		switch (id.type) {
			case "Identifier":
				return {
					type: "Normal",
					name: id.name,
				};
			default:
				throw new Error("未実装の代入情報");
		}
	}

	private convertDeclaration(): string[] {
		const results: string[] = [];

		for (const dec of this.state.declarations) {
			const id = this.idConvert(dec.id);

			// TODO: 分割代入のサポート
			if (dec.init === null) {
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
