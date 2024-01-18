<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { ConfigProps } from '../utils/type';
	import Input from './Input.svelte';
	import Switch from './Switch.svelte';
	import Radio from './Radio.svelte';
	import Button from './Button.svelte';

	const idChar = 'aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ';
	const generateId = () => {
		let r = '';
		for (let i = 0; i < 6; i++) {
			r += idChar.charAt(Math.floor(Math.random() * idChar.length));
		}
		return r;
	};
	const numericValid = /^\s*[+-]?(\d+|\d*\.\d+|\d+\.\d*)([Ee][+-]?\d*)?\s*$/;

	export let value: ConfigProps;

	const dispatch = createEventDispatcher<{
		remove: void;
	}>();
	const radioList: ConfigProps['type'][] = ['boolean', 'number', 'string'];

	let inputDefault = '';
	let inputDefaultBool = false;

	$: if (value.type === 'boolean') {
		inputDefault = '';
		value.default = inputDefaultBool;
	} else {
		inputDefaultBool = false;
		if (value.type === 'number') {
			let numRes = Number(inputDefault);
			if (!isFinite(numRes)) {
				numRes = 0;
			}
			value.default = numRes;
		} else {
			value.default = inputDefault;
		}
	}
</script>

<div class="root">
	<div>
		<h3>名前</h3>
		<Input id={generateId()} bind:value={value.configName} />
	</div>
	<div>
		<h3>型</h3>
		<Radio {radioList} bind:value={value.type} />
	</div>
	<div>
		<h3>ラベル</h3>
		<Input id={generateId()} bind:value={value.label} />
	</div>
	<div>
		<h3>説明</h3>
		<Input id={generateId()} bind:value={value.description} />
	</div>
	<div>
		<h3>Default Value</h3>
		{#if value.type === 'boolean'}
			<div class="switch-content">
				<Switch id={generateId()} bind:checked={inputDefaultBool} />
				<p>{inputDefaultBool}</p>
			</div>
		{:else if value.type === 'number'}
			<Input id={generateId()} bind:value={inputDefault} valid={(v) => numericValid.test(v)} />
		{:else}
			<Input id={generateId()} bind:value={inputDefault} />
		{/if}
	</div>
	<Button onclick={() => dispatch('remove')}>Remove</Button>
</div>

<style>
	.root {
		margin-top: 10px;
		padding: 10px;
		border-top: 1px solid #fff;
	}

	.switch-content {
		display: flex;
		align-items: center;
		gap: 10px;
		font-size: 1.5em;
	}
</style>
