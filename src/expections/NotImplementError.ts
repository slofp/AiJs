import { ConvertError } from './ConvertError';

export class NotImplementError extends ConvertError {
	public constructor(message?: ConvertError['message'], start?: ConvertError['start'], end?: ConvertError['end']) {
		super(message, start, end);
		this.name = 'NotImplementError';
	}
}
