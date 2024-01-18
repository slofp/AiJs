import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import monacoEditorPlugin from 'vite-plugin-monaco-editor';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';

const file = fileURLToPath(new URL('../package.json', import.meta.url));
const json = readFileSync(file, 'utf8');
const pkg = JSON.parse(json);

// https://vitejs.dev/config/
export default defineConfig({
	base: process.env.IS_GITHUB_ACTION ? "/AiJs/" : "/",
	plugins: [
		svelte(),
		monacoEditorPlugin.default({
			languageWorkers: [
				'editorWorkerService',
				'typescript',
			],
			publicPath: "AiJs/monacoeditorwork",
		}),
	],
	define: {
		VERSION: JSON.stringify(pkg.version)
	}
});
