// マングル時、javascript規定外の名前が含まれているとマングルしてしまう。
// これはそれを防ぐための定義実装

const num = ['to_str'];

// arrと共通するものはarrに統一
const str = [
	'to_num',
	'to_arr',
	'to_unicode_arr',
	'to_unicode_codepoint_arr',
	'to_char_arr',
	'to_charcode_arr',
	'to_utf8_byte_arr',
	'pick',
	'index_of',
	'upper',
	'lower',
	'charcode_at',
	'codepoint_at',
];

const arr = ['len', 'incl', 'copy'];

const error = ['name', 'info'];

export const excludeRegExp = new RegExp(`^(?!(${[...num, ...str, ...arr, ...error].join('|')})$)`);
