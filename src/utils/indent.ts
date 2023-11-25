// TODO: これをクラス化して各変換クラスに渡すようにする

export let insertNewLine = true;
export let insertWhiteSpace = true;
export let repeatWhiteSpace = 2;

export function generateIndents() {
	return ' '.repeat(repeatWhiteSpace);
}

export function nestIndents(state: string) {
	return generateIndents() + state.split('\n').join('\n' + generateIndents());
}

export function optionalNewLine() {
	return insertNewLine ? '\n' : '';
}

export function optionalWhiteSpace() {
	return insertWhiteSpace ? ' ' : '';
}

export function setIndents(indents: boolean) {
	insertNewLine = insertWhiteSpace = indents;
	if (!indents) {
		repeatWhiteSpace = 0;
	}
	else {
		repeatWhiteSpace = 2;
	}
}
