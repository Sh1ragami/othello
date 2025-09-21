Othello (React + TypeScript)

人間対人間で遊べるオセロを React + TypeScript で実装しました。AI を後付けしやすいよう、`src/ai` にエンジンのプラグイン構造を用意しています。

使い方
- 依存関係をインストール: `npm install`
- 開発サーバー: `npm run dev`
- ビルド: `npm run build` → プレビュー: `npm run preview`

ディレクトリ構成
- `src/ai/` — AI エンジンの実装と登録
  - `types.ts` — エンジン共通インターフェース
  - `human.ts` — 人間用（UI 操作）エンジン
  - `index.ts` — 利用可能なエンジンの登録 (`ENGINES`)
- `src/game/` — 盤面・ルールロジック
  - `logic.ts` — 合法手探索・反転・終了判定など
  - `types.ts`, `constants.ts`
- `src/components/` — UI コンポーネント（盤面・セル・コントロール）
- `src/App.tsx` — 状態管理と対局進行（AI 呼び出しのハブ）

AI の追加方法
1. `src/ai/my-engine.ts` を作成し、`Engine` インターフェースを実装します。

```
import type { Engine } from './types'
import type { Board, Move, Player } from '@game/types'

export const MyEngine: Engine = {
  id: 'my-engine',
  name: 'My Engine',
  isHuman: false,
  async selectMove(board: Board, player: Player, valid: Move[]) {
    // 例: 一番裏返し枚数が多い手を選ぶ
    if (valid.length === 0) return null
    return valid.reduce((a, b) => (a.flips.length >= b.flips.length ? a : b))
  },
}
```

2. `src/ai/index.ts` の `ENGINES` 配列に追加します。

```
import { MyEngine } from './my-engine'
export const ENGINES: Engine[] = [HumanEngine, MyEngine]
```

3. アプリの右上のセレクタから Black/White に `My Engine` を選択すると自動で手が指されます。

備考
- 初期状態は Black/White ともに `Human`（人間）です。
- パス（合法手なし）は自動処理されます。両者とも打てなくなったら終了し、枚数で勝敗判定します。
- ルールロジックは `src/game/logic.ts` に集約しており、AI は同ロジックを呼ぶだけで実装可能です。

