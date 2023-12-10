import { parseScript } from 'meriyah';
import { convertFromProgram } from './convert';
import { Config, ConvertOptions, MetaData } from './type';
import { minifyIdentifier } from './utils/jsMinify';
import { nestIndents, optionalNewLine, optionalWhiteSpace, setIndents } from './utils/indent';
import { ConvertError } from './expections/ConvertError';

function toCodingAiScriptVersion() {
	return '/// @ 0.16.0';
}

function toStringPermissionArray(permissions: NonNullable<MetaData['permissions']>) {
	const perms = new Set(permissions);
	const result = [...perms].map(v => `'${v}'`).join(`,${optionalNewLine()}`);
	return `[${optionalNewLine()}${nestIndents(result)}${optionalNewLine()}]`;
}

function toStringConfigFieldData(data: Config) {
	const result = [
		`type: '${data.type}'`,
		`label: '${data.label}'`,
		`description: '${data.description}'`,
	];
	if (typeof data.default === 'string') {
		result.push(`default: '${data.default}'`);
	}
	else {
		result.push(`default: ${data.default}`);
	}

	return `{${optionalNewLine()}${nestIndents(result.join(`,${optionalNewLine()}`))}${optionalNewLine()}}`;
}

function toStringConfigObject(config: NonNullable<MetaData['config']>) {
	const result = [];
	for (const key in config) {
		result.push(`${key}: ${toStringConfigFieldData(config[key])}`);
	}

	return `{${optionalNewLine()}${nestIndents(result.join(`,${optionalNewLine()}`))}${optionalNewLine()}}`;
}

function toCodingMetadata(meta: MetaData) {
	const objectProperty = [];
	if (meta.name) {
		objectProperty.push(`name: '${meta.name}'`);
	}
	if (meta.author) {
		objectProperty.push(`author: '${meta.author}'`);
	}
	if (meta.version) {
		objectProperty.push(`version: '${meta.version}'`);
	}
	if (meta.description) {
		objectProperty.push(`description: '${meta.description}'`);
	}
	if (meta.permissions && meta.permissions.length !== 0) {
		objectProperty.push(`permissions: ${toStringPermissionArray(meta.permissions)}`);
	}
	if (meta.config && Object.keys(meta.config).length !== 0) {
		objectProperty.push(`config: ${toStringConfigObject(meta.config)}`);
	}

	return `###${optionalWhiteSpace()}{${optionalNewLine()}${nestIndents(objectProperty.join(`,${optionalNewLine()}`))}${optionalNewLine()}}`;
}

export async function convert(src: string, options?: ConvertOptions) {
	const result = [];

	let source = src;
	if (options) {
		if (options.minify) {
			source = await minifyIdentifier(source);
			setIndents(false);
		}
		else {
			setIndents(true);
		}
		if (options.insertVersion) {
			result.push(toCodingAiScriptVersion());
		}
		if (options.meta) {
			result.push(toCodingMetadata(options.meta));
		}
	}
	else {
		setIndents(true);
	}

	try {
		const program = parseScript(source);
		result.push(convertFromProgram(program));
		return result.join('\n');
	}
	catch (err) {
		if (err && typeof err === 'object' &&
			('line' in err && typeof err.line === 'number') &&
			('column' in err && typeof err.column === 'number') &&
			('description' in err && typeof err.description === 'string')
		) {
			throw new ConvertError(err.line, err.column, err.description);
		}
		throw err;
	}
}
