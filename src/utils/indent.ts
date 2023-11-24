export let whiteSpace = 2;

export function generateIndents() {
	return ' '.repeat(whiteSpace);
}

export function nestIndents(state: string) {
	return generateIndents() + state.split('\n').join('\n' + generateIndents());
}
