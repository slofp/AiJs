export class UnsupportedStatementError extends Error {
	public constructor(message?: string) {
		super(message);
		this.name = 'UnsupportedStatementError';
	}
}
