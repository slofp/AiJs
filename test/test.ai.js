let name = "";

Ui.render([
	Ui.C.textInput({
		label: "Your name",
		onInput(v) {
			name = v;
		}
	}),
	Ui.C.button({
		text: "Hello",
		onClick: () => Mk.dialog(null, `Hello, ${name}!`)
	})
]);
