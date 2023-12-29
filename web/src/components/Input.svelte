<script lang="ts">
	export let id = 'empty';
	export let value = '';
	export let valid: (text: string) => boolean = (_) => true;

	const keypressEvent = (
		e: KeyboardEvent & {
			currentTarget: EventTarget & HTMLInputElement;
		}
	) => {
		const pos = e.currentTarget.selectionStart ?? undefined;
		if (!valid(value.slice(0, pos) + e.key + value.slice(pos, value.length))) {
			e.preventDefault();
		}
	};
</script>

<div>
	<input type="text" name="" {id} bind:value on:keypress={keypressEvent} />
</div>

<style>
	div {
		position: relative;
		display: block;

		width: 100%;
		max-width: 400px;

		border-radius: 2px;
		padding: 0.7em 1em 0.8em;

		background: #ffffff0a;
	}

	div::after {
		content: '';
		position: absolute;
		z-index: 1;
		left: 0px;
		bottom: 0px;

		width: 100%;
		height: 2px;

		border-bottom-left-radius: 2px;
		border-bottom-right-radius: 2px;

		background-color: #646cff;
	}

	input {
		color: #e9e8ff;
		font-size: 1.25em;
		vertical-align: middle;
		width: 100%;
	}
</style>
