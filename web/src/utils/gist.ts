import type { ConvertOptions } from '../../../src/type';
import { Octokit } from '@octokit/rest';

const aijsMetaFileName = '__aijs_meta__.json';
const installingFileName = '__get__.json';

export type AijsMeta = {
	jsSource: string;
	config: ConvertOptions;
};

export function isAiJsProjectGist<T>(files: { [key: string]: T }) {
	return aijsMetaFileName in files;
}

export function getResultSrc(files: { [key: string]: { content?: string } | null }) {
	if (installingFileName in files && files[installingFileName] && files[installingFileName].content !== undefined) {
		const installObj: { data: string } = JSON.parse(files[installingFileName].content);
		return installObj.data;
	}
	return '';
}

export async function gistGetList(apiKey: string) {
	const octokit = new Octokit({ auth: apiKey });
	const list = (await octokit.gists.list()).data;
	const res: [string, string][] = [];
	for (const d of list) {
		if (isAiJsProjectGist(d.files)) {
			res.push([d.id, d.description ?? '']);
		}
	}

	return res;
}

export async function gistGetJson(gistId: string) {
	const octokit = new Octokit();
	return (await octokit.gists.get({ gist_id: gistId })).data;
}

export async function gistGetMeta(gistId: string): Promise<AijsMeta> {
	const apiData = await gistGetJson(gistId);
	if (
		apiData.files &&
		aijsMetaFileName in apiData.files &&
		apiData.files[aijsMetaFileName] &&
		apiData.files[aijsMetaFileName].content !== undefined
	) {
		return JSON.parse(apiData.files[aijsMetaFileName].content) as AijsMeta;
	}

	throw new Error('not found aijs meta');
}

function createFileData(meta: AijsMeta, result: string) {
	const files: { [key: string]: { content: string } } = {};
	files[aijsMetaFileName] = { content: JSON.stringify(meta) };
	files[installingFileName] = {
		content: JSON.stringify({
			type: 'plugin',
			data: result,
		}),
	};

	return files;
}

export async function gistCreate(description: string, apiKey: string, meta: AijsMeta, result: string) {
	const octokit = new Octokit({ auth: apiKey });

	const files = createFileData(meta, result);

	const res = await octokit.gists.create({
		description,
		files,
		public: false,
	});

	return res.data;
}

export async function gistUpdate(description: string, apiKey: string, gistId: string, meta: AijsMeta, result: string) {
	const octokit = new Octokit({ auth: apiKey });

	const files = createFileData(meta, result);

	const res = await octokit.gists.update({
		gist_id: gistId,
		files,
		description,
	});

	return res.data;
}

async function digestSHA512(text: string) {
	const encodedText = new TextEncoder().encode(text);
	const hashBuffer = await crypto.subtle.digest('SHA-512', encodedText);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
	return hashHex;
}

export async function getInstallUrlNonOrigin(username: string, gistId: string, source: string) {
	const hash = await digestSHA512(source);
	return `/install-extentions?url=https://gist.githubusercontent.com/${username}/${gistId}/raw/${installingFileName}&hash=${hash}`;
}
