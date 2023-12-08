import { convert } from '@slofp/aijs';
import { readFile, writeFile } from 'fs/promises';

(async () => {
	const source = await readFile('./test.ai.js', 'utf8');
	const result = await convert(source, {
		insertVersion: true,
		meta: {
			
		}
	});
	console.log(result);
	await writeFile('./test.ai', result, 'utf8');
	const resultMinify = await convert(source, {
		minify: true
	});
	console.log(resultMinify);
	await writeFile('./test.min.ai', resultMinify, 'utf8');
})();
