import { ConvertError } from './ConvertError';

export class UnsupportedStatementError extends ConvertError {
	public constructor(message: ConvertError['message'] = 'サポートされない文', start?: ConvertError['start'], end?: ConvertError['end']) {
		super(message, start, end);
		this.name = 'UnsupportedStatementError';
	}
}
