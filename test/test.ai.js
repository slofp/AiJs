const E = 1e+15, v = 5;
var text = '';

function chouYen(n) {
	return n * E;
}

let r;
r = chouYen(v)
r /= E / 1000
text = '欲しい！';
print(`${r}兆円\n${text}`);
