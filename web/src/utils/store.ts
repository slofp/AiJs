import type { ConvertOptions } from '../../../src/type';

type Key = 'aijs:code' | 'aijs:config' | 'aijs:gistApi';

const getStore = (key: Key) => {
	return window.localStorage.getItem(key);
};

const setStore = (key: Key, value: string) => {
	window.localStorage.setItem(key, value);
};

export function getCode() {
	return getStore('aijs:code') ?? '';
}

export function setCode(code: string) {
	setStore('aijs:code', code);
}

export function getConfig(): ConvertOptions {
	const v = getStore('aijs:config');
	if (v === null) {
		return {};
	}
	return JSON.parse(v) as ConvertOptions;
}

export function setConfig(config: ConvertOptions) {
	setStore('aijs:config', JSON.stringify(config));
}

export function getApiKey() {
	return getStore('aijs:gistApi') ?? '';
}

export function setApiKey(key: string) {
	setStore('aijs:gistApi', key);
}
