import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // GitHub Pages 向けの静的エクスポート設定
  // `next build` 実行時に out/ ディレクトリへ HTML/CSS/JS を出力する
  output: "export",

  // GitHub Pages のリポジトリパス（https://<user>.github.io/hassou-lab/）に対応
  basePath: "/hassou-lab",

  // 静的エクスポート時は Next.js の画像最適化サーバーが使えないため無効化する
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
