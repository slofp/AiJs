<script lang="ts">
	import { onMount } from 'svelte';
	import Popup from './Popup.svelte';
	import Password from './Password.svelte';
	import Input from './Input.svelte';
	import Button from './Button.svelte';
	import { getApiKey, setApiKey } from '../utils/store';
	import { gistCreate, gistUpdate, getInstallUrlNonOrigin, gistGetJson, isAiJsProjectGist, type AijsMeta, getResultSrc } from '../utils/gist';
	import { createShareUrl } from '../utils/misskeyHubShare';

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
	let copiedFlag = false;
	const copyUrl = async () => {
		if (navigator.clipboard) {
			await navigator.clipboard.writeText(`https://${origin}${uri}`);
			copiedFlag = true;
			await new Promise((r) => setTimeout(r, 1000));
			copiedFlag = false;
		}
	};
	const shareHub = () => {
		window.open(createShareUrl(description, `https://${origin}${uri}`, `${location.origin}/?gist=${gistId}`, origin), '_blank', 'noreferrer');
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
	<p class="title">Gistに保存</p>
	{#if showResult}
		<p class="gistId">
			{#if isSaved}保存しました！<br />{/if}
			GistId: <a href={`./?gist=${gistId}`}>{gistId}</a>
		</p>
		<div class="textField">
			<p>URLオリジン</p>
			<Input bind:value={origin} id="origin" valid={(v) => /^[a-zA-Z.]*$/.test(v)} />
		</div>
		<div class="install-urls">
			<p>プラグインインストールなど (必要なら)</p>
			<div class="buttons">
				<Button onclick={copyUrl}>
					{#if copiedFlag}
					コピーしました！
					{:else}
						インストールURLを<br />
						コピー
					{/if}
				</Button>
				<Button onclick={shareHub}>
					misskey-hubで<br />
					共有
				</Button>
			</div>
		</div>
	{:else}
		{#if isAiJsProject}
			<p class="gistId">現在のGistId: <a href={`./?gist=${gistId}`}>{gistId}</a></p>
		{/if}
		<div class="textField">
			<p>apiキー</p>
			<Password bind:value={apiKey} id="apiPass" />
		</div>
		<div class="textField">
			<p>説明</p>
			<Input bind:value={description} id="gistDescription" />
		</div>
		{#if apiKey.trim().length === 0 && gistId === undefined}
			<p class="message">apiキーを入力してください</p>
		{:else}
			<div class="buttons">
				{#if apiKey.trim().length !== 0}
					<Button onclick={createGist}>新規作成</Button>
					{#if isAiJsProject}
						<Button onclick={updateGist}>上書き</Button>
					{/if}
				{/if}
				{#if gistId !== undefined}
					<Button onclick={share}>共有</Button>
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
