import { ConvertError } from './ConvertError';

export class UnsupportedExpressionError extends ConvertError {
	public constructor(message: ConvertError['message'] = 'サポートされない式', start?: ConvertError['start'], end?: ConvertError['end']) {
		super(message, start, end);
		this.name = 'UnsupportedExpressionError';
	}
}
