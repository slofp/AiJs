<script lang="ts">
	import Popup from './Popup.svelte';
	import Password from './Password.svelte';
	import { getApiKey, setApiKey } from '../utils/store';
	import { gistGetList } from '../utils/gist';

	export let switchShow: boolean;

	let apiKey = getApiKey();
	let prevApi = apiKey;

	$: if (apiKey !== prevApi) {
		setApiKey(apiKey);
		prevApi = apiKey;
	}
</script>

<Popup bind:switchShow>
	<p class="title">Gistを選択</p>
	<div class="apikey">
		<p>apiキー</p>
		<Password bind:value={apiKey} id="apiPass" />
	</div>
	<div class="list">
		{#if apiKey.trim().length === 0}
			<p>apiキーを入力してください</p>
		{:else}
			{#await gistGetList(apiKey)}
				<p>読み込み中...</p>
			{:then list}
				{#if list.length === 0}
					<p>なし</p>
				{:else}
					{#each list as e}
						<p><a href={`./?gist=${e[0]}`}>{e[0]} - {e[1]}</a></p>
					{/each}
				{/if}
			{:catch e}
				<p>{e}</p>
			{/await}
		{/if}
	</div>
</Popup>

<style>
	.title {
		text-align: center;
		margin-bottom: 10px;
		font-weight: bold;
		font-size: 1.5em;
	}

	.apikey {
		margin-bottom: 10px;
	}

	.apikey p {
		margin-bottom: 5px;
		margin-left: 5px;
	}

	.list {
		background-color: #171717;
		padding: 10px;
		min-width: 400px;
		max-height: 400px;
		overflow-y: scroll;
	}

	.list > p:not(:has(a)) {
		padding: 10px;
	}

	.list > p > a {
		display: inline-block;
		width: 100%;
		height: 100%;
		padding: 10px;
		text-decoration: none;
	}

	.list > p > a:hover {
		background-color: rgba(255, 255, 255, 0.2);
	}
	.list > p > a:visited {
		color: rgba(255, 255, 255, 0.87);
	}

	.list > p + p {
		border-top: solid 1px #fff;
	}
</style>
