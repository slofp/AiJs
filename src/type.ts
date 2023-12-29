export type Permissions =
	| 'read:account'
	| 'write:account'
	| 'read:blocks'
	| 'write:blocks'
	| 'read:drive'
	| 'write:drive'
	| 'read:favorites'
	| 'write:favorites'
	| 'read:following'
	| 'write:following'
	| 'read:messaging'
	| 'write:messaging'
	| 'read:mutes'
	| 'write:mutes'
	| 'write:notes'
	| 'read:notifications'
	| 'write:notifications'
	| 'write:reactions'
	| 'write:votes'
	| 'read:pages'
	| 'write:pages'
	| 'write:page-likes'
	| 'read:page-likes'
	| 'write:gallery-likes'
	| 'read:gallery-likes';

export type Config = {
	type: 'string' | 'number' | 'boolean';
	label: string;
	description: string;
	default: string | number | boolean;
};

export type MetaData = {
	name?: string;
	author?: string;
	version?: string;
	description?: string;
	permissions?: Permissions[];
	config?: { [key: string]: Config };
};

export type ConvertOptions = {
	minify?: boolean;
	meta?: MetaData;
	insertVersion?: boolean;
};
