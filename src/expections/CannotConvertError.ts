import { ConvertError } from './ConvertError';

export class CannotConvertError extends ConvertError {
	public constructor(message?: ConvertError['message'], start?: ConvertError['start'], end?: ConvertError['end']) {
		super(message, start, end);
		this.name = 'CannotConvertError';
	}
}
