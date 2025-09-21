<div align="center">
  <img width="800" alt="image" src="https://github.com/user-attachments/assets/55949228-f0ad-4b1b-aeae-10b1c0fdf132" />

  [![Live](https://img.shields.io/badge/Play%20Now-othello--five.vercel.app-00C853?logo=vercel&logoColor=white)](https://othello-five.vercel.app/)
  ![対戦モード](https://img.shields.io/badge/%E5%AF%BE%E6%88%A6-%E4%BA%BA%E9%96%93%E2%86%94AI%20%7C%20AI%E2%86%94AI-blue)
  ![効果音](https://img.shields.io/badge/%E5%8A%B9%E6%9E%9C%E9%9F%B3-on-success)
  ![デバイス](https://img.shields.io/badge/%E5%AF%BE%E5%BF%9C-PC%20%7C%20Tablet%20%7C%20Mobile-informational)

<br>

  ブラウザで遊べるシンプルなオセロです。人間同士はもちろん、AIとも対戦できます。
  
  いますぐ遊ぶ　URL: https://othello-five.vercel.app/
  
  <img width="600" alt="image" src="https://github.com/user-attachments/assets/a70de30a-bad2-4302-9dd4-97819d2df0d1" />
</div>

<br>

遊び方（基本操作）
- 盤面の合法手はうっすら表示されます。置きたいマスをタップ/クリックします。
- 右上の「黒 / 白」セレクタで、人間/AIを切り替えられます（例: 黒=人間、白=AI）。
- 「新規対局」で最初からやり直し。

画面の見方
- 勝率バー（上部）
  - 黒と白の勝率を1本のバーで表示します。終局時は勝者が100%、引き分けは50/50。
- ステータス/勝者表示（盤面上）
  - 現在の手番や、パス、対局終了と勝者を表示します。
- 盤面
  - 直近の着手は駒の中心に赤い丸で強調表示。
  - 合法手は薄いマークで表示。
- 着手ログ（右側）
  - 最新の手が常に見えるよう自動スクロールします。
  - 各手の座標（A1～H8）と評価差分（±）を表示します。
- タイムライン（盤面の下）
  - ⏮/◀/▶/⏭ と再生で、対局のリプレイができます（リプレイ中は着手不可）。

サウンドについて
- 駒を置いて相手の駒を返すと、反転枚数に応じて短い効果音が鳴ります。
- 初回はブラウザの自動再生制限により音が出ない場合があります。画面を一度タップ/クリックすると有効になります。

よくある質問
- AIの手がすぐに置かれて見づらい
  - AIの着手には短い待機時間（約0.5秒）を入れてあります。人間の手は即時反映です。
- 音が出ない
  - 初回に画面をタップ/クリックすると有効になります。端末の音量設定もご確認ください。
- スマホでの表示が窮屈
  - 端末の横向き表示や、ブラウザのUIを最小化することで見やすくなります。

推奨環境
- 最新版の Chrome / Safari / Firefox / Edge
- スマートフォン/タブレット/PCに対応（より快適なのはタブレット/PC）

ローカルでも遊びたい（任意）
- Node.js をインストール後、以下で起動できます。
  - 依存関係: `npm install`
  - 開発サーバ: `npm run dev`（http://localhost:5173）


