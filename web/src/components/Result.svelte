<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import Loading from './Loading.svelte';
	import * as monaco from 'monaco-editor';
	import { loadWASM } from 'onigasm'; // peer dependency of 'monaco-textmate'
	import { Registry } from 'monaco-textmate'; // peer dependency
	import { wireTmGrammars } from 'monaco-editor-textmate';
	import { registerTheme } from '../utils/defaultDarkTheme';

	export let src = '';

	let initialized = false;
	let divContainer: HTMLDivElement;
	let editor: monaco.editor.IStandaloneCodeEditor | undefined;
	onMount(async () => {
		const grammerText = await (await fetch(`https://raw.githubusercontent.com/aiscript-dev/aiscript-vscode/main/aiscript/syntaxes/aiscript.tmLanguage.json`)).text();

		try {
			await loadWASM('https://esm.sh/onigasm@2.2.5/lib/onigasm.wasm');
		} catch (_) {
			// すでにロードされているならエラーになるので特に何もしない。
		}

		const registry = new Registry({
			getGrammarDefinition: (_) =>
				new Promise((r) => {
					r({
						format: 'json',
						content: grammerText,
					});
			}),
		});

		const grammars = new Map();
		grammars.set('aiscript', 'source.ai');

		monaco.languages.register({ id: 'aiscript' });
		registerTheme();

		editor = monaco.editor.create(divContainer, {
			value: src,
			language: 'aiscript',
			automaticLayout: true,
			theme: 'editorTheme',
			fontSize: 15,
			wordWrap: 'on',
			readOnly: true,
			domReadOnly: true,
			readOnlyMessage: { value: 'このコードは読み込み専用です' },
		});
		initialized = true;

		await wireTmGrammars(monaco, registry, grammars, editor);
	});

	onDestroy(() => {
		editor?.dispose();
	});

	$: editor?.setValue(src);
</script>

{#if !initialized}
	<Loading />
{/if}
<div class="result-code-frame" bind:this={divContainer}></div>
