import { ConvertError } from './ConvertError';

export class UnsupportedClassObjectError extends ConvertError {
	public constructor(message: ConvertError['message'] = 'サポートされないクラスオブジェクト', start?: ConvertError['start'], end?: ConvertError['end']) {
		super(message, start, end);
		this.name = 'UnsupportedClassObjectError';
	}
}
