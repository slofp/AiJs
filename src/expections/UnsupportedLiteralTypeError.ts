import { ConvertError } from './ConvertError';

export class UnsupportedLiteralTypeError extends ConvertError {
	public constructor(message: string = 'unsupported literal', start?: ConvertError['start'], end?: ConvertError['end']) {
		super(message, start, end);
		this.name = 'UnsupportedLiteralTypeError';
	}
}
