export function createShareUrl(description: string, installUrl: string, editorUrl: string, origin: string) {
	const text = `${description}\n\nプラグインインストールURL: ${installUrl}\n\nコードURL: ${editorUrl}`;
	return `https://misskey-hub.net/share/?text=${encodeURIComponent(text)}&visibility=public&localOnly=0&manualInstance=${origin}`;
}
