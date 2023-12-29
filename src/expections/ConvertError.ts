import { Node } from 'acorn';

type Location = NonNullable<Node['loc']>;

export class ConvertError extends Error {
	public constructor(message?: string);

	public constructor(message?: string, pos?: Location['start'] | null);

	public constructor(message?: string, start?: Location['start'] | null, end?: Location['end'] | null);

	public constructor(
		message?: string,
		public start: Location['start'] | null = null,
		public end: Location['end'] | null = null
	) {
		let pos = '';
		if (end !== null && start !== null) {
			pos = `(${end.line}:${end.column})`;
		}
		else if (end === null && start !== null) {
			end = start;
		}
		super(message + pos);
		this.name = 'ConvertError';
	}
}
