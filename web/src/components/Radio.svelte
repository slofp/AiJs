<script lang="ts" generics="T extends string">
	export let radioList: T[];
	export let value: T;

	const change = (e: { currentTarget: HTMLInputElement }) => {
		value = e.currentTarget.value as T;
	};
</script>

<div>
	{#each radioList as r}
		<label>
			<input checked={value === r} on:change={change} type="radio" name="" value={r} />
			<span>{r}</span>
		</label>
	{/each}
</div>

<style>
	div {
		margin: 10px;
		margin-left: 0;
	}
	input {
		display: none;
	}

	label {
		border: 1px solid #646cff;
		border-radius: 10px;
		margin-right: 10px;
		padding: 10px;
		font-weight: 500;
		transition: background-color 100ms;
	}

	label:has(input:checked) {
		background-color: #646cff77;
	}

	label:hover {
		background-color: #646cff22;
	}
</style>
