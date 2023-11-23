import { convert } from '@slofp/aijs';
import { readFile, writeFile } from 'fs/promises';

(async () => {
	const source = await readFile('./test.ai.js', 'utf8');
	const result = convert(source);

	console.log(result);
	await writeFile('./test.ai', result, 'utf8');
})();
