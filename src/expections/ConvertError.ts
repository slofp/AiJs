export class ConvertError extends Error {
	public constructor(public line: number, public col: number, message?: string) {
		super(message);
		this.name = "ConvertError";
	}
}
