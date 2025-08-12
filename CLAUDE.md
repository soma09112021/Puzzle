# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

幼児向けのジグソーパズルゲーム。3〜6歳の子供がタブレットのブラウザで楽しめる教育的なパズルアプリケーション。

## Development Commands

```bash
# ローカルサーバーの起動（開発用）
python3 -m http.server 8000
# または
npx serve .

# ブラウザでアクセス
open http://localhost:8000
```

## Architecture

### ファイル構成
- `index.html` - アプリケーションのHTML構造（全画面を含む）
- `style.css` - スタイリングとアニメーション
- `script.js` - ゲームロジック（PuzzleGameクラス）

### 主要なクラス/機能
- **PuzzleGame**: メインのゲームコントローラー
  - 年齢別難易度管理（3歳:4ピース、4歳:6ピース、5歳:9ピース、6歳:12ピース）
  - ドラッグ&ドロップ機能（タッチ対応）
  - コインシステムとローカルストレージでのデータ永続化
  - 4つのテーマ（動物、乗り物、果物、海の生き物）

### 画面構成
1. **スタート画面** - 年齢選択
2. **テーマ選択画面** - パズルのカテゴリ選択
3. **ゲーム画面** - パズル本体
4. **完成画面** - 報酬表示

## Notes

- タブレットのタッチ操作に最適化済み
- データはLocalStorageに保存（コイン数など）
- 音声はBase64エンコードのダミーデータ（実装時は実際の音声ファイルに置き換え推奨）