<script lang="ts">
	import CodeMirror from 'svelte-codemirror-editor';
	// TODO: AiScript書式にする
	import { javascript } from '@codemirror/lang-javascript';
	// なぜかこうしないと動かない、謎
	import { vscodeDark } from '@uiw/codemirror-theme-vscode/src/index';
	import { EditorView } from '@codemirror/view';

	export let src = '';
</script>

<CodeMirror
	bind:value={src}
	basic
	lang={javascript()}
	extensions={[EditorView.lineWrapping]}
	theme={vscodeDark}
	readonly
	editable={false}
	styles={{
		'&': {
			textAlign: 'left',
			width: '100%',
			height: '100%',
		},
	}}
	class="editor-root"
/>
