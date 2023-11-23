export class UnsupportedLiteralTypeError extends Error {
	public constructor(message?: string) {
		super(message);
		this.name = 'UnsupportedLiteralTypeError';
	}
}
