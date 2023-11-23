export class UnsupportedExpressionError extends Error {
	public constructor(message?: string) {
		super(message);
		this.name = 'UnsupportedExpressionError';
	}
}
