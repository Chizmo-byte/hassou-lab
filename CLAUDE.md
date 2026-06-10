@AGENTS.md

# Hassou Lab

## プロジェクト概要

「近未来的なデジタル実験室」をコンセプトにしたランディングサイト。
キャッチコピーは **「常識を壊し、AIで『新しい面白さ』を生成する。」**。
将来的に各種 AI 実験ツールをこのサイト上に公開していく。現在はトップページ
（ラボ・エントランス）と「Coming Soon...」のツールギャラリーのみを実装。

- **フレームワーク**: Next.js 16 (App Router) + TypeScript
- **スタイリング**: Tailwind CSS v4
- **デザイン**: ダークモード基調 + ネオン系アクセント（シアン / ライムグリーン）
- **公開先**: GitHub Pages（静的エクスポート）
- **想定 Node.js**: v22

## ディレクトリ構成

```
hassou-lab/
├── src/app/
│   ├── layout.tsx    # ルートレイアウト / メタデータ
│   ├── page.tsx      # トップページ（ラボ・エントランス）
│   └── globals.css   # グローバルスタイル（Tailwind）
├── public/           # 静的アセット
├── next.config.ts    # 静的エクスポート設定
└── CLAUDE.md
```
## 開発体制・運用ルール

- 戦略設計はすあま（外部AI）が行い、指示書としてChizmo経由で渡される
- 指示書の意図と完了定義を最優先し、独断で仕様変更しない
- **`git push` はChizmoが行う。Claude Codeはコミットまでで止めること**
- 実装完了後は変更ファイル一覧と結果を簡潔に報告する

## ビルドコマンド

| コマンド | 説明 |
| --- | --- |
| `npm run dev` | 開発サーバーを起動（http://localhost:3000） |
| `npm run build` | 本番ビルド & 静的エクスポート（`out/` を生成） |
| `npm run lint` | ESLint によるチェック |

GitHub Pages 用の静的ファイルは **`npm run build`** で `out/` ディレクトリに生成される。
（`output: 'export'` を設定済みのため `next export` は不要。）

## 静的エクスポートの注意点

`next.config.ts` で以下を設定している。GitHub Pages 公開のため変更時は要注意。

- `output: 'export'` — `out/` に静的 HTML/CSS/JS を出力する。
- `basePath: '/hassou-lab'` — リポジトリ名に対応。**ローカルの `npm run dev`
  でも `/hassou-lab` 配下で配信される**点に注意。リポジトリ名を変えたら必ず更新する。
- `images: { unoptimized: true }` — 静的エクスポートでは Next.js の画像最適化
  サーバーが使えないため無効化必須。`next/image` を使う場合も `src` に
  `basePath` を意識すること。

その他の制約:

- サーバー機能（Route Handlers の動的処理、`cookies()` / `headers()`、ISR、
  Server Actions など）は静的エクスポートでは利用不可。
- ルートには末尾スラッシュが付く挙動になるため、内部リンクは相対パスや
  `next/link` を用いて basePath を考慮する。
- GitHub Pages は Jekyll 処理を行うため、`out/` に `.nojekyll` を置くと
  `_next` ディレクトリが無視されない（デプロイワークフローで生成すること）。

## セキュリティチェック

公開・PR・依存更新の前に以下を確認すること。

- [ ] **シークレットの混入チェック**: API キー・トークン・パスワード等を
      コミットしていない。`.env*` は `.gitignore` 済みであることを確認。
- [ ] **クライアントへの露出**: 静的サイトに同梱されるコードは全て公開される。
      `NEXT_PUBLIC_` 変数や `out/` に機密情報が含まれていないか確認。
- [ ] **依存関係の脆弱性**: `npm audit` を実行し、High/Critical を放置しない。
      依存を更新したらビルドが通ることを確認する。
- [ ] **外部リンク**: `target="_blank"` のリンクには `rel="noopener noreferrer"`
      を付与し、タブナビング（reverse tabnabbing）を防ぐ。
- [ ] **ユーザー入力 / dangerouslySetInnerHTML**: 生 HTML 挿入は原則禁止。
      使う場合は必ずサニタイズする（XSS 対策）。
- [ ] **外部リソース**: 信頼できない CDN・スクリプトを読み込まない。
      可能なら CSP（Content-Security-Policy）を検討する。
- [ ] **ライセンス**: 追加した画像・フォント・ライブラリのライセンスを確認。
