<script lang="ts">
	import { onMount } from 'svelte';
	import Popup from './Popup.svelte';
	import Password from './Password.svelte';
	import Input from './Input.svelte';
	import Button from './Button.svelte';
	import { getApiKey, setApiKey } from '../utils/store';
	import { gistCreate, gistUpdate, getInstallUrlNonOrigin, gistGetJson, isAiJsProjectGist, type AijsMeta, getResultSrc } from '../utils/gist';

	export let gistId: string | undefined = undefined;
	export let aijsMeta: AijsMeta;
	export let resultSource: string;
	export let switchShow: boolean;

	let apiKey = getApiKey();
	let prevApi = apiKey;

	$: if (apiKey !== prevApi) {
		setApiKey(apiKey);
		prevApi = apiKey;
	}

	let description = '';
	let isAiJsProject = false;

	let showResult = false;
	let isSaved = false;
	let uri = '';
	const createGist = async () => {
		const res = await gistCreate(description, apiKey, aijsMeta, resultSource);
		uri = await getInstallUrlNonOrigin(res.owner?.login ?? '', res.id ?? '', resultSource);
		gistId = res.id ?? '???';
		isSaved = showResult = true;
	};
	const updateGist = async () => {
		const res = await gistUpdate(description, apiKey, gistId!, aijsMeta, resultSource);
		uri = await getInstallUrlNonOrigin(res.owner?.login ?? '', res.id ?? '', resultSource);
		isSaved = showResult = true;
	};
	const share = async () => {
		const res = await gistGetJson(gistId!);
		const username = res.owner?.login ?? '';
		const src = res.files ? getResultSrc(res.files) : '';
		uri = await getInstallUrlNonOrigin(username, gistId!, src);
		showResult = true;
	};

	onMount(async () => {
		if (gistId !== undefined) {
			const res = await gistGetJson(gistId);
			if (res.files && isAiJsProjectGist(res.files)) {
				isAiJsProject = true;
				description = res.description ?? '';
			}
		}
	});

	let origin = 'misskey.io';
</script>

<Popup bind:switchShow>
	<p class="title">Save Gist</p>
	{#if showResult}
		<p class="gistId">
			{#if isSaved}Saved!<br />{/if}
			GistId: <a href={`./?gist=${gistId}`}>{gistId}</a>
		</p>
		<div class="textField">
			<p>Origin</p>
			<Input bind:value={origin} id="origin" valid={(v) => /^[a-zA-Z.]*$/.test(v)} />
		</div>
		<div class="install-urls">
			<p>Plugin install url (if need)</p>
			<p><a href={`https://${origin}${uri}`} target="_blank" rel="noopener noreferrer">{`https://${origin}${uri}`}</a></p>
		</div>
	{:else}
		{#if isAiJsProject}
			<p class="gistId">Current gistId: <a href={`./?gist=${gistId}`}>{gistId}</a></p>
		{/if}
		<div class="textField">
			<p>api key</p>
			<Password bind:value={apiKey} id="apiPass" />
		</div>
		<div class="textField">
			<p>Description</p>
			<Input bind:value={description} id="gistDescription" />
		</div>
		{#if apiKey.trim().length === 0}
			<p class="message">Input the api key.</p>
		{:else}
			<div class="buttons">
				<Button onclick={createGist}>Create</Button>
				{#if isAiJsProject}
					<Button onclick={updateGist}>Update</Button>
					<Button onclick={share}>Share</Button>
				{/if}
			</div>
		{/if}
	{/if}
</Popup>

<style>
	.title {
		text-align: center;
		margin-bottom: 10px;
		font-weight: bold;
		font-size: 1.5em;
	}

	.gistId {
		text-align: center;
		margin-bottom: 10px;
	}

	.textField {
		margin-bottom: 10px;
	}

	.textField p {
		margin-bottom: 5px;
		margin-left: 5px;
	}

	.buttons {
		padding: 10px;

		display: flex;
		justify-content: center;
		align-items: center;
		gap: 10px;
	}

	.message {
		text-align: center;
		padding: 10px;
	}

	.install-urls {
		max-width: 400px;
		text-align: center;
		word-wrap: break-word;
	}
</style>
