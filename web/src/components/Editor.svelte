<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import Loading from './Loading.svelte';
	import * as monaco from 'monaco-editor';
	import { registerTheme } from '../utils/defaultDarkTheme';

	export let src = '';
	export let changefunc: ((text: string) => void) | null = null;

	let initialized = false;
	let divContainer: HTMLDivElement;
	let editor: monaco.editor.IStandaloneCodeEditor | undefined;
	onMount(async () => {
		const aitsLibSource = await (await fetch('https://raw.githubusercontent.com/slofp/aitslib/main/index.d.ts')).text();

		monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
			module: monaco.languages.typescript.ModuleKind.ESNext,
			strict: true,
			alwaysStrict: true,
			lib: [],
			allowJs: true,
			target: monaco.languages.typescript.ScriptTarget.ESNext,
			checkJs: true,
			allowNonTsExtensions: true,
		});

		monaco.languages.typescript.typescriptDefaults.addExtraLib(aitsLibSource, 'aitslib.d.ts');

		registerTheme();
		editor = monaco.editor.create(divContainer, {
			value: src,
			language: 'typescript',
			automaticLayout: true,
			theme: 'editorTheme',
			fontSize: 15,
			insertSpaces: false,
			tabSize: 4,
		});
		editor.onKeyUp((e) => {
			if (e.keyCode === monaco.KeyCode.Quote) {
				editor!.trigger('', 'editor.action.triggerSuggest', '');
			}
		});

		editor.onDidChangeModelContent((_) => {
			if (changefunc !== null) {
				changefunc(editor!.getValue());
			}
		});

		initialized = true;
	});

	onDestroy(() => {
		editor?.dispose();
	});
</script>

{#if !initialized}
	<Loading />
{/if}
<div class="editor-root" bind:this={divContainer}></div>
