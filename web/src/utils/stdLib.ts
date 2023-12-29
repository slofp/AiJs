import { scopeCompletionSource } from '@codemirror/lang-javascript';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const dummyFunc = () => {};
const dummyProp = '';

const Core = {
	v: dummyProp,
	type: dummyFunc,
	to_str: dummyFunc,
	sleep: dummyFunc,
};

const Util = { uuid: dummyFunc };

const Json = {
	stringify: dummyFunc,
	parse: dummyFunc,
	parsable: dummyFunc,
};

const Date = {
	now: dummyFunc,
	year: dummyFunc,
	month: dummyFunc,
	day: dummyFunc,
	hour: dummyFunc,
	minute: dummyFunc,
	second: dummyFunc,
	parse: dummyFunc,
};

const _Math = {
	Infinity: dummyProp,
	E: dummyProp,
	LN2: dummyProp,
	LN10: dummyProp,
	LOG2E: dummyProp,
	LOG10E: dummyProp,
	PI: dummyProp,
	SQRT1_2: dummyProp,
	SQRT2: dummyProp,
	abs: dummyFunc,
	sign: dummyFunc,
	round: dummyFunc,
	ceil: dummyFunc,
	floor: dummyFunc,
	trunc: dummyFunc,
	min: dummyFunc,
	max: dummyFunc,
	sqrt: dummyFunc,
	cbrt: dummyFunc,
	hypot: dummyFunc,
	sin: dummyFunc,
	cos: dummyFunc,
	tan: dummyFunc,
	asin: dummyFunc,
	acos: dummyFunc,
	atan: dummyFunc,
	atan2: dummyFunc,
	sinh: dummyFunc,
	cosh: dummyFunc,
	tanh: dummyFunc,
	asinh: dummyFunc,
	acosh: dummyFunc,
	atanh: dummyFunc,
	pow: dummyFunc,
	exp: dummyFunc,
	expm1: dummyFunc,
	log: dummyFunc,
	log1p: dummyFunc,
	log10: dummyFunc,
	log2: dummyFunc,
	rnd: dummyFunc,
	gen_rng: dummyFunc,
	clz32: dummyFunc,
	fround: dummyFunc,
	imul: dummyFunc,
};

const Num = {
	to_hex: dummyFunc,
	from_hex: dummyFunc,
};

const Str = {
	lf: dummyProp,
	lt: dummyFunc,
	gt: dummyFunc,
	from_codepoint: dummyFunc,
	from_unicode_codepoints: dummyFunc,
	from_utf8_bytes: dummyFunc,
};

const Obj = {
	keys: dummyFunc,
	vals: dummyFunc,
	kvs: dummyFunc,
	get: dummyFunc,
	set: dummyFunc,
	has: dummyFunc,
	copy: dummyFunc,
	merge: dummyFunc,
};

const Error = { create: dummyFunc };

const Async = {
	interval: dummyFunc,
	timeout: dummyFunc,
};

export const stdLibCompletionScope = scopeCompletionSource({
	print: dummyFunc,
	readline: dummyFunc,
	Core,
	Util,
	Json,
	Date,
	Math: _Math,
	Num,
	Str,
	Obj,
	Error,
	Async,
});
