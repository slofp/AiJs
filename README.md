# Ai.js

javascriptから[AiScript](https://github.com/aiscript-dev/aiscript)に変換します。

## 使い方

まだインストールはできませんが直にできるようになります。

```shell
npm install @slofp/aijs
```

### API

* `convert(sourceCode: string, options?: ConvertOption): Promise<string>`

【引数】

* `sourceCode: string`
javascriptソースコード

* `options?: ConvertOption`
変換時のオプション、なければ通常設定で変換されます

【返り値】

`Promise<string>`
変換されたAiScriptソースコード

【オプション型】

### ConvertOption

* `minify?: boolean`
変換コードのインデントなどをなくし小さくします。

* `meta?: MetaData`
AiScriptをMisskeyで使用するときのメタデータを指定できます。

* `insertVersion?: boolean`
AiScriptのバージョンをコード最上部に記述します。

### MetaData

* `name?: string`
名前

* `author?: string`
作成者

* `version?: string`
バージョン

* `description?: string`
説明

permissions?: Permissions[];
コードを使用するために必要な権限

* `config?: { [key: string]: Config }`
コンフィグ情報を定義します。
また、keyはstringを提示しますがAiScriptに則ったkeyでなければエラーになります。

### Config

* `type: 'string' | 'number' | 'boolean'`
設定値の型

* `label: string`
設定で表示される名前

* `description: string`
設定で表示される説明

* `default: string | number | boolean`
デフォルト値
