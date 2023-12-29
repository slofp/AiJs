import { ConvertError } from './ConvertError';

export class UnsupportedLiteralTypeError extends ConvertError {
	public constructor(start?: ConvertError['start'], end?: ConvertError['end']) {
		super('unsupported literal', start, end);
		this.name = 'UnsupportedLiteralTypeError';
	}
}
