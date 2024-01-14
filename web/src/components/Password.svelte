<script lang="ts">
	export let id = 'empty';
	export let value = '';
</script>

<form action="javascript:void(0);">
	<input type="password" name="" {id} bind:value autocomplete="off" />
</form>

<style>
	form {
		position: relative;
		display: block;

		width: 100%;
		max-width: 400px;

		border-radius: 2px;
		padding: 0.7em 1em 0.8em;

		background: #ffffff0a;
	}

	form::after {
		content: '';
		position: absolute;
		z-index: 1;
		left: 0px;
		bottom: 0px;

		width: 100%;
		height: 2px;

		border-bottom-left-radius: 2px;
		border-bottom-right-radius: 2px;

		background-color: #ff6464;
	}

	input {
		color: #e9e8ff;
		font-size: 1.25em;
		vertical-align: middle;
		width: 100%;
	}
</style>
