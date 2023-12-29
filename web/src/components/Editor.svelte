<script lang="ts">
	import CodeMirror from 'svelte-codemirror-editor';
	import { syntaxTree } from '@codemirror/language';
	import { javascript, snippets, localCompletionSource, completionPath } from '@codemirror/lang-javascript';
	import { CompletionContext, autocompletion, completeFromList, type Completion } from '@codemirror/autocomplete';
	// なぜかこうしないと動かない、謎
	import { vscodeDark } from '@uiw/codemirror-theme-vscode/src/index';
	import { stdLibCompletionScope } from '../utils/stdLib';
	import { misskeyLibCompletionScope } from '../utils/misskeyLib';

	const kwCompletion = (name: string) => ({ label: name, type: 'keyword' });
	const keywords =
		'break case const continue default delete export extends false finally in instanceof let new return static super switch this throw true typeof var yield'
			.split(' ')
			.map(kwCompletion);

	const ScopeNodes = new Set(['Script', 'Block', 'FunctionExpression', 'FunctionDeclaration', 'ArrowFunction', 'MethodDeclaration', 'ForStatement']);

	function objectCompletions(context: CompletionContext) {
		const path = completionPath(context);
		if (!path || path.path.length === 0) {
			return null;
		}
		const mainPath = path.path[0];
		const inner = syntaxTree(context.state).resolveInner(context.pos, -1);
		const options: Completion[] = [];
		for (let n: typeof inner | null = inner; n; n = n.parent) {
			if (ScopeNodes.has(n.name)) {
				n.cursor().iterate((nn) => {
					if (nn.name === 'VariableDeclaration') {
						const idNode = nn.node.getChild('VariableDefinition');
						if (!idNode) {
							return;
						}
						const id = context.state.doc.sliceString(idNode.from, idNode.to);
						if (id !== mainPath) {
							return;
						}
						const objNode = nn.node.getChild('ObjectExpression');
						if (!objNode) {
							return;
						}
						const props = objNode
							.getChildren('Property')
							.map((v) => v.getChildren('PropertyDefinition'))
							.reduce((p, c) => [...p, ...c]);
						for (const p of props) {
							const propId = context.state.doc.sliceString(p.from, p.to);
							console.log(propId);
							options.push({
								label: '.' + propId,
								displayLabel: propId,
								type: 'property',
							});
						}
					}
				});
			}
		}
		return {
			options,
			from: inner.from,
			validFor: /\.([\w$\xa1-\uffff][\w$\d\xa1-\uffff]*)?$/,
		};
	}

	const exts = [
		autocompletion({
			override: [
				completeFromList(snippets.concat(keywords)),
				localCompletionSource,
				stdLibCompletionScope,
				misskeyLibCompletionScope,
				objectCompletions,
			],
		}),
	];

	export let src = '';
	export let changefunc: ((text: string) => void) | null = null;
</script>

<CodeMirror
	bind:value={src}
	basic
	lang={javascript()}
	useTab
	tabSize={4}
	extensions={exts}
	theme={vscodeDark}
	styles={{
		'&': {
			textAlign: 'left',
			width: '100%',
			height: '100%',
		},
	}}
	class="editor-root"
	on:change={(v) => (changefunc !== null ? changefunc(v.detail) : undefined)}
/>
