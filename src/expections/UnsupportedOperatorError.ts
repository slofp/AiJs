export class UnsupportedOperatorError extends Error {
	public constructor(message?: string) {
		super(message);
		this.name = 'UnsupportedOperatorError';
	}
}
