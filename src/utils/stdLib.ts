const stdLib = [
	'Core',
	'Util',
	'Json',
	'Date',
	'Math',
	'Num',
	'Str',
	'Obj',
	'Error',
	'Async',
	'Mk',
	'Ui',
];

const ui = [
	'C'
];

export function identifierStdName(id: string) {
	return stdLib.some(v => v === id);
}

export function uiNestIdentifierName(id: string) {
	return ui.some(v => v === id);
}
