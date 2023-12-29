import { ConvertError } from './ConvertError';

export class UnsupportedOperatorError extends ConvertError {
	public constructor(message: ConvertError['message'] = 'unsupport operator', start?: ConvertError['start'], end?: ConvertError['end']) {
		super(message, start, end);
		this.name = 'UnsupportedOperatorError';
	}
}
