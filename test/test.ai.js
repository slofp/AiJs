function hoshii() {
	return '5000兆円欲しい！';
}

for (let i = 10; i > 0; i -= 1) {
	if (i % 2 === 0) {
		print(`にゃー${i}`)
	}
	else {
		print(hoshii())
		if (i % 3 === 0) {
			print('にゅん')
		}
	}
}
