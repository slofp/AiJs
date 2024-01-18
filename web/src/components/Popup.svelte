<script lang="ts">
	export let switchShow: boolean;

	let rootEl: HTMLDivElement;

	let isDown = false;
	const mouseUpEvent = (e: MouseEvent) => {
		if (isDown && e.target === rootEl) {
			switchShow = false;
		}
		isDown = false;
	};

	const mouseDownEvent = (e: MouseEvent) => {
		if (e.target === rootEl) {
			isDown = true;
		}
	};
</script>

<svelte:window on:mouseup={mouseUpEvent} on:mousedown={mouseDownEvent} />

<div class="popup-root" bind:this={rootEl}>
	<div class="popup-window">
		<slot />
	</div>
</div>

<style>
	.popup-root {
		position: fixed;
		left: 0;
		top: 0;
		width: 100vw;
		height: 100vh;
		background-color: hsla(0, 0%, 0%, 0.3);
		display: flex;
		align-items: center;
		z-index: 9999999;
	}

	.popup-window {
		margin: 0 auto;
		background-color: #242424;
		padding: 20px;
		border-radius: 20px;
	}
</style>
