// Base54(base53) Original Source: https://github.com/terser/terser/blob/master/lib/scope.js#L1015
// Sort Original Source: https://github.com/terser/terser/blob/master/lib/utils/index.js#L150

// AiScript identifier cannot use $.

function mergeSort<T>(array: T[], cmp: (a: T, b: T) => number) {
	if (array.length < 2) {
		return array.slice();
	}
	function merge(a: T[], b: T[]) {
		var r = [],
			ai = 0,
			bi = 0,
			i = 0;
		while (ai < a.length && bi < b.length) {
			cmp(a[ai], b[bi]) <= 0 ? (r[i++] = a[ai++]) : (r[i++] = b[bi++]);
		}
		if (ai < a.length) {
			r.push.apply(r, a.slice(ai));
		}
		if (bi < b.length) {
			r.push.apply(r, b.slice(bi));
		}
		return r;
	}
	function _ms(a: T[]) {
		if (a.length <= 1) {
			return a;
		}
		var m = Math.floor(a.length / 2),
			left = a.slice(0, m),
			right = a.slice(m);
		left = _ms(left);
		right = _ms(right);
		return merge(left, right);
	}
	return _ms(array);
}

export const base53 = (() => {
	const leading = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_'.split('');
	const digits = '0123456789'.split('');
	let chars: string[];
	let frequency: Map<string, number>;
	function reset() {
		frequency = new Map();
		leading.forEach(function (ch) {
			frequency.set(ch, 0);
		});
		digits.forEach(function (ch) {
			frequency.set(ch, 0);
		});
	}
	function consider(str: string, delta: number) {
		for (var i = str.length; --i >= 0; ) {
			frequency.set(str[i], frequency.get(str[i])! + delta);
		}
	}
	function compare(a: string, b: string) {
		return frequency.get(b)! - frequency.get(a)!;
	}
	function sort() {
		chars = mergeSort(leading, compare).concat(mergeSort(digits, compare));
	}
	// Ensure this is in a usable initial state.
	reset();
	sort();
	function base53(num: number) {
		var ret = '',
			base = 53;
		num++;
		do {
			num--;
			ret += chars[num % base];
			num = Math.floor(num / base);
			base = 63;
		} while (num > 0);
		return ret;
	}

	return {
		get: base53,
		consider,
		reset,
		sort,
	};
})();
