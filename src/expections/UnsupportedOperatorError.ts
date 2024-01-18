import { ConvertError } from './ConvertError';

export class UnsupportedOperatorError extends ConvertError {
	public constructor(message: ConvertError['message'] = 'サポートされない演算子', start?: ConvertError['start'], end?: ConvertError['end']) {
		super(message, start, end);
		this.name = 'UnsupportedOperatorError';
	}
}
