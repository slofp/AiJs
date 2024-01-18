<script lang="ts">
	import { onMount } from 'svelte';
	import { convert } from '@slofp/aijs/src/index';
	import Button from './components/Button.svelte';
	import Editor from './components/Editor.svelte';
	import Result from './components/Result.svelte';
	import Options from './components/Options.svelte';
	import LoadGist from './components/LoadGist.svelte';
	import SaveGist from './components/SaveGist.svelte';
	import type { ConvertOptions } from '../../src/type';
	import { getCode, getConfig, setCode, setConfig } from './utils/store';
	import { gistGetMeta } from './utils/gist';

	const urlParams = new URLSearchParams(window.location.search);
	const gistId = urlParams.get('gist');

	const storedPrevCode = getCode();
	const storedOptions = getConfig();

	let prevCode = '';
	let jsSrc = prevCode;
	let resultSrc = '';
	let options: ConvertOptions = {};
	let errored = false;
	let errMessage = '';

	const saveData = (js: string, op: ConvertOptions) => {
		setCode(js);
		setConfig(op);
	};

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

		saveData(js, checkedOptions);

		convert(js, checkedOptions)
			.then((src) => {
				errored = false;
				errMessage = '';
				resultSrc = src;
			})
			.catch((e) => {
				if (e instanceof Error) {
					errMessage = e.message;
					errored = true;
				} else {
					console.error(e);
				}
			});
	};

	const changeSrcFunc = (v: string) => {
		jsSrc = v;
	};

	$: updateResult(jsSrc, options);

	let openOptions = false;
	let openLoadGist = false;
	let openSaveGist = false;

	onMount(async () => {
		if (gistId === null) {
			prevCode = storedPrevCode;
			jsSrc = prevCode;
			options = storedOptions;
			//updateResult(jsSrc, options);
			return;
		}

		try {
			const meta = await gistGetMeta(gistId);
			prevCode = meta.jsSource;
			jsSrc = prevCode;
			options = meta.config;
		} catch (error) {
			console.error(error);
		}
	});
</script>

<header>
	<div>
		<!-- svelte-ignore missing-declaration -->
		<!-- eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -->
		<h1>JavaScript to AiScript Converter (ai.js v{VERSION})</h1>
	</div>
	<div>
		<Button onclick={() => (openSaveGist = !openSaveGist)}>SaveGist</Button>
		<Button onclick={() => (openLoadGist = !openLoadGist)}>LoadGist</Button>
		<Button onclick={() => (openOptions = !openOptions)}>Options</Button>
	</div>
</header>

<main>
	<div class="size">
		<h2>Javascript Code</h2>
		<Editor changefunc={changeSrcFunc} src={prevCode} />
	</div>
	<div class="size">
		{#if openOptions}
			<h2>Options</h2>
			<Options bind:options />
		{:else}
			<h2>AiScript Result</h2>
			<div class="editor-root">
				<Result bind:src={resultSrc} />
				{#if errored}
					<div class="error-container">
						<p>{errMessage}</p>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</main>

<footer>
	<p>AiJs | <a href="https://github.com/slofp/AiJs" target="_blank" rel="noopener noreferrer">github</a></p>
</footer>

{#if openLoadGist}
	<LoadGist bind:switchShow={openLoadGist} />
{/if}
{#if openSaveGist}
	<SaveGist bind:switchShow={openSaveGist} gistId={gistId ?? undefined} aijsMeta={{ config: options, jsSource: jsSrc }} resultSource={resultSrc} />
{/if}

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
		position: relative;
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

	.error-container {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		background-color: rgb(218, 73, 73);
		color: #fff;
		padding: 15px;
		z-index: 999;
	}
	.error-container p {
		font-weight: bold;
		letter-spacing: 1.5;
	}
</style>
