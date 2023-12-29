import { scopeCompletionSource } from '@codemirror/lang-javascript';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const dummyFunc = () => {};
const dummyProp = '';

const Mk = {
	dialog: dummyFunc,
	confirm: dummyFunc,
	api: dummyFunc,
	save: dummyFunc,
	load: dummyFunc,
	url: dummyFunc,
	nyaize: dummyFunc,
};

const Ui = {
	root: dummyProp,
	patch: dummyFunc,
	get: dummyFunc,
	render: dummyFunc,
	C: {
		container: dummyFunc,
		text: dummyFunc,
		mfm: dummyFunc,
		textarea: dummyFunc,
		textInput: dummyFunc,
		numberInput: dummyFunc,
		button: dummyFunc,
		buttons: dummyFunc,
		switch: dummyFunc,
		select: dummyFunc,
		folder: dummyFunc,
		postFormButton: dummyFunc,
		postForm: dummyFunc,
	},
};

export const misskeyLibCompletionScope = scopeCompletionSource({
	USER_ID: dummyProp,
	USER_NAME: dummyProp,
	USER_USERNAME: dummyProp,
	CUSTOM_EMOJIS: dummyProp,
	LOCALE: dummyProp,
	SERVER_URL: dummyProp,
	Mk,
	Ui,
});
