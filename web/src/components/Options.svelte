<script lang="ts">
	import type { ConvertOptions } from '../../../src/type';
	import type { ConfigProps } from '../utils/type';
	import Button from './Button.svelte';
	import ConfigPart from './ConfigPart.svelte';
	import Input from './Input.svelte';
	import Switch from './Switch.svelte';

	export let options: ConvertOptions;

	const permissionsList: NonNullable<NonNullable<ConvertOptions['meta']>['permissions']> = [
		'read:account',
		'read:blocks',
		'read:drive',
		'read:favorites',
		'read:following',
		'read:gallery-likes',
		'read:messaging',
		'read:mutes',
		'read:notifications',
		'read:page-likes',
		'read:pages',
		'write:account',
		'write:blocks',
		'write:drive',
		'write:favorites',
		'write:following',
		'write:gallery-likes',
		'write:messaging',
		'write:mutes',
		'write:notes',
		'write:notifications',
		'write:page-likes',
		'write:pages',
		'write:reactions',
		'write:votes',
	] as const;

	let meta: NonNullable<ConvertOptions['meta']> = options.meta ?? {};

	let configProps: ConfigProps[] = meta.config
		? Object.entries(meta.config).map((v) => ({
				configName: v[0],
				...v[1],
			}))
		: [];
	const addConfig = () => {
		configProps = [
			...configProps,
			{
				configName: '',
				type: 'boolean',
				label: '',
				description: '',
				default: '',
			},
		];
	};
	const removeConfig = (i: number) => {
		configProps = configProps.toSpliced(i, 1);
	};

	type metaPermissionObject = { [K in (typeof permissionsList)[number]]?: boolean };
	let metaPermissions: metaPermissionObject =
		meta.permissions?.reduce((p, v) => {
			p[v] = true;
			return p;
		}, {} as metaPermissionObject) ?? {};
	let insertMeta = !!options.meta;
	$: if (!insertMeta) {
		options.meta = undefined;
	} else if (!options.meta) {
		options.meta = meta;
	}

	$: if (insertMeta && meta) {
		options.meta = meta;
	}

	$: if (insertMeta && metaPermissions) {
		const newPerm: typeof permissionsList = [];
		for (const [key, value] of Object.entries(metaPermissions)) {
			if (value) {
				newPerm.push(key as (typeof permissionsList)[number]);
			}
		}
		meta.permissions = newPerm;
	}

	$: if (insertMeta && configProps) {
		const config: NonNullable<NonNullable<ConvertOptions['meta']>['config']> = {};
		for (const prop of configProps) {
			config[prop.configName] = {
				type: prop.type,
				label: prop.label,
				description: prop.description,
				default: prop.default,
			};
		}
		meta.config = config;
	}
</script>

<div class="editor-root">
	<div class="switch-container">
		<Switch id="minify" bind:checked={options.minify} />
		<h3>コード圧縮</h3>
	</div>
	<div class="switch-container">
		<Switch id="isv" bind:checked={options.insertVersion} />
		<h3>aiバーションを挿入</h3>
	</div>
	<div class="switch-container">
		<Switch id="imd" bind:checked={insertMeta} />
		<h3>メタデータを挿入</h3>
	</div>
	{#if insertMeta}
		<div>
			<div>
				<h3>名前</h3>
				<Input id="name" bind:value={meta.name} />
			</div>
			<div>
				<h3>作成者</h3>
				<Input id="author" bind:value={meta.author} />
			</div>
			<div>
				<h3>バージョン</h3>
				<Input id="version" bind:value={meta.version} />
			</div>
			<div>
				<h3>説明</h3>
				<Input id="description" bind:value={meta.description} />
			</div>
			<div>
				<h3>権限</h3>
				{#each permissionsList as v}
					<div class="switch-container meta-switch">
						<Switch id={v} bind:checked={metaPermissions[v]} />
						<h3>{v}</h3>
					</div>
				{/each}
			</div>
			<div>
				<h3>コンフィグ</h3>
				<Button onclick={addConfig}>追加</Button>
				{#each configProps as v, i}
					<ConfigPart bind:value={v} on:remove={() => removeConfig(i)} />
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	div {
		padding: 10px;
		overflow-y: scroll;
	}

	.switch-container {
		font-size: 1.5em;
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.meta-switch {
		font-size: 1em;
	}
</style>
