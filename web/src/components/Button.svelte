<script lang="ts">
	export let onclick: () => void;
</script>

<button on:click={onclick}>
	<slot />
</button>

<style>
	button {
		border-radius: 8px;
		border: 1px solid transparent;
		padding: 0.6em 1.2em;
		font-size: 1em;
		font-weight: 500;
		font-family: inherit;
		background-color: #1a1a1a;
		cursor: pointer;
		transition: border-color 0.25s;
	}

	button:hover {
		border-color: #646cff;
	}

	button:focus,
	button:focus-visible {
		outline: 1px solid #7e84ff;
	}
</style>
