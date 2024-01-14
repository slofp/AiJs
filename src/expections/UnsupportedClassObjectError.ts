import { ConvertError } from './ConvertError';

export class UnsupportedClassObjectError extends ConvertError {
	public constructor(message: ConvertError['message'] = 'unsupported class object', start?: ConvertError['start'], end?: ConvertError['end']) {
		super(message, start, end);
		this.name = 'UnsupportedClassObjectError';
	}
}
