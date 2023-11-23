export class CannotConvertError extends Error {
	public constructor(message?: string) {
		super(message);
		this.name = 'CannotConvertError';
	}
}
