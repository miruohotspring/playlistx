# ARCHITECTURE

## 目的
- 迷いを減らし開発速度と品質を上げるための実運用ルール集。
- クライアント/サーバー、page/component、機能/共通の境界を明確化。
- 変更に強い構成（型安全・責務分離・命名一貫性）を全員が再現可能にする。

## ルート構成テンプレ
```txt
.
├─ public/               # 公開アセット（画像・アイコン）
├─ src/
│  └─ app/
│     ├─ [lang]/         # 言語セグメント（layout.tsx, (groups)）
│     ├─ _features/      # 機能単位（UI/状態/ロジックを局所化）
│     ├─ _lib/           # サーバー/外部I/F・共通ライブラリ
│     ├─ _serverActions/ # Server Actions（副作用・DB・外部API呼び出し）
│     ├─ _common/        # 定数・ロガーなど横断関心
│     ├─ api/            # app router の API ルート
│     └─ i18n/           # 国際化（client.tsx/server.ts/settings.ts/locales）
├─ tsconfig.json         # paths（@lib/* 等）
└─ next.config.mjs       # distDir=./dist 他
```

## ディレクトリごとの責務（主要）
| Dir | 責務 | 置くもの | 置かないもの |
|---|---|---|---|
| public/ | 公開静的資産 | icons/*.png, *.svg | 機密/生成物 |
| app/[lang]/ | ルート構成 | layout.tsx, route組成 | UI汎用部品 |
| app/_features/ | 機能単位のUI/状態 | Feature UI, hooks, 小さなstate | 横断ユーティリティ |
| app/_lib/ | サーバー/外部I/F | Dynamo, auth, provider, config | 画面依存UI |
| app/_serverActions/ | Server Actions | DB更新/外部API呼び出し | クライアント専用処理 |
| app/_common/ | 横断 | constants, logger | 機能固有実装 |
| app/i18n/ | 国際化 | client/server/settings/locales | ビジネルール |

## page と component の分離規則（App Router）
- page/layout はルーティングとデータ取得の起点のみを担当。
- 複雑なUI/ロジックは _features の Component/Hook に委譲。
- 例: app/[lang]/page.tsx → 最小のデータフェッチ + <FeatureX /> を組む。
- アンチ: page 内に肥大化したフォーム/状態管理/副作用。

## server / client の分離
- 原則 server-first。React Server Components を既定。
- use client が必要なときのみ Client Component（フォーム、DOM API、イベント多用）。
- Server Actions は app/_serverActions/ に配置し、UI から呼び出す。
- 機密やトークン操作は必ずサーバー層（_lib/_serverActions）。

## 各レイヤの基準（hooks/utils/types/schemas/api-client/lib/features）
- hooks: 再利用可能なロジック。機能専用は _features/<Feature>/hooks。共有は _features/hooks か _common。
- utils: 副作用のない純関数。場所は _common/utils か 機能直下の utils。
- types: 型は src/types と 各レイヤの近傍に配置（DTO は dto/）。
- schemas: zod 等のスキーマは API 入出力の直近に置く（dto/schema.ts）。
- api-client: クライアントからの API 呼び出し層。フェッチ関数は機能直下に薄く配置。
- lib: 外部I/Fやサーバー共通（Dynamo/auth/config）。
- features: 画面機能単位で UI/hooks/小ロジックを内包して凝集。

## 環境変数（採用ルール）
- クライアント公開は NEXT_PUBLIC_ を必須（R1）。
- config モジュールで一元読み取り・型検証・必須チェック（R2）。
- アセットURLは public 配下は /icons/... のパスで管理（R6）。

## 命名規約（例とアンチ）
- ファイル: kebab-case（get-signed-stream-url.ts）。アンチ: 空白・大文字混在。
- ディレクトリ: kebab-case または PascalCase for Feature（Playlists/）。
- 型: PascalCase（UserProfile, PlaylistDTO）。接尾辞 DTO/Schema/Props。
- コンポーネント: PascalCase（HeaderLayout.tsx）。
- テスト: *.test.ts(x)（同階層 or __tests__）。Story: *.stories.tsx（同階層）。

## ファイル分割の判断基準
- 行数: ~200行で分割検討、>400行は分割。
- 責務: 1ファイル=1責務（I/O, UI, 変換, 検証の混在を避ける）。
- 凝集度: 関連の強い関数/状態は同居、無関係は分離。
- 再利用性: 他画面で使うなら hooks/utils へ抽出。
- 依存方向: UI→ロジック→I/F の一方向を維持。

## 例外と棚卸し
- 例外: 納期・PoC で暫定の混在を許容（page内ロジック等）。
- 条件: PR に TODO/期限/恒久対応方針を記載。
- 棚卸し: 月1回、アーキ担当が例外リストを精査し是正計画を更新。

## 参考：安全にコードを移動する手順
- git mv で履歴を保ちつつ移動。
- import path を一括更新（tsconfig paths を活用）。
- 型・テストを先に修正→ローカル実行（pnpm build, pnpm dev）。
- CI（lint/format/types）で回帰確認→PRに移動理由と影響範囲を添付。

