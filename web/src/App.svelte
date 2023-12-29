<script lang="ts">
	import { convert } from '@slofp/aijs/src/index';
	import Button from './components/Button.svelte';
	import Editor from './components/Editor.svelte';
	import Result from './components/Result.svelte';
	import Options from './components/Options.svelte';
	import type { ConvertOptions } from '../../src/type';

	let jsSrc = '';
	let resultSrc = '';
	let options: ConvertOptions = { minify: false };

	const updateResult = (js: string, op: ConvertOptions) => {
		const checkedOptions: ConvertOptions = {
			...op,
			meta: !op.meta
				? undefined
				: {
						name: op.meta.name?.trim().length !== 0 ? op.meta.name : undefined,
						author: op.meta.author?.trim().length !== 0 ? op.meta.author : undefined,
						description: op.meta.description?.trim().length !== 0 ? op.meta.description : undefined,
						version: op.meta.version?.trim().length !== 0 ? op.meta.version : undefined,
						permissions: op.meta.permissions,
						config: op.meta.config,
					},
		};
		console.log(checkedOptions);
		convert(js, checkedOptions)
			.then((src) => (resultSrc = src))
			.catch((e) => {
				console.error(e);
			});
	};

	const changeSrcFunc = (v: string) => {
		jsSrc = v;
	};

	$: updateResult(jsSrc, options);

	let openOptions = false;
</script>

<header>
	<div>
		<h1>JavaScript to AiScript Converter (ai.js v0.0.2)</h1>
	</div>
	<div>
		<Button onclick={() => (openOptions = !openOptions)}>Options</Button>
	</div>
</header>

<main>
	<div class="size">
		<h2>Javascript Code</h2>
		<Editor changefunc={changeSrcFunc} />
	</div>
	<div class="size">
		{#if openOptions}
			<h2>Options</h2>
			<Options bind:options />
		{:else}
			<h2>AiScript Result</h2>
			<Result bind:src={resultSrc} />
		{/if}
	</div>
</main>

<footer>
	<p>AiJs | <a href="https://github.com/slofp/AiJs">github</a></p>
</footer>

<style>
	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 5px;
	}

	main {
		display: flex;
		justify-content: space-between;
		gap: 20px;

		width: 100%;
		height: calc(calc(100% - 3em) - 45px);
	}

	footer {
		text-align: center;
		width: 100%;
		padding: 10px;
	}

	.size {
		width: 100%;
		height: 100%;
	}

	h1 {
		font-size: 2em;
		line-height: 1;
	}
	h2 {
		font-size: 1.5em;
		line-height: 1.5;
	}

	a {
		font-weight: 500;
		color: #646cff;
		text-decoration: inherit;
	}
	a:hover {
		color: #535bf2;
	}
</style>
