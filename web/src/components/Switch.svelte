<script lang="ts">
	export let id = 'empty';
	export let checked = false;
</script>

<label for={id}>
	<input type="checkbox" name="" {id} bind:checked />
	<div></div>
</label>

<style>
	label {
		display: inline-block;
		cursor: pointer;
		font-size: 2em;
	}
	input {
		display: none;
	}

	div {
		background-color: #ddd;

		transition: background-color 250ms;

		width: 1em;
		height: 0.5em;

		position: relative;

		border-radius: 0.5em;
	}

	div::after {
		content: '';
		position: absolute;

		top: 0.05em;
		left: 0.05em;

		width: 0.4em;
		height: 0.4em;

		background-color: #fff;

		border-radius: 1em;
		transition: transform 250ms;
	}

	input:checked ~ div {
		background-color: #646cff;
	}
	input:checked ~ div::after {
		transform: translateX(0.5em);
	}
</style>
