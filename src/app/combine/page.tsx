"use client";

import Link from "next/link";
import { useState } from "react";

// 2つのワードを掛け合わせる「エッジの効いたプロンプト」を生成する
function buildPrompt(a: string, b: string): string {
  return `あなたは、ブルーオーシャン戦略の権威であり、最先端のプロダクトデザイナー、そして行動経済学の専門家である『超・概念設計アーキテクト』です。

今から【${a}】と【${b}】という、一見して全く接点のない2つの要素を掛け合わせ、世界に類を見ない『禁断の新サービス』を構築してください。

思考プロセス：
コア価値の抽出： AとBが持つ、ユーザーにとっての『根源的な価値』をそれぞれ定義せよ。
概念的衝突： その2つの価値を衝突させ、矛盾から生まれる『新しい体験価値』を導き出せ。
具体的具現化： その体験を、現代のテクノロジー（AI、IoT、Web等）を用いてどう実現するか、具体的なツール形式に落とし込め。

出力フォーマット：
🛠️ PROJECT CODE: [コンセプト名]
【核心的な価値】： なぜこの組み合わせが、人々の好奇心を強烈に刺激するのか。
【心理的フック】： ユーザーが『えっ？』となり、思わずクリックしてしまう正体は何か。
【実装ブループリント】：
Step 1 (MVP): 最小限の機能で価値を証明する方法。
Step 2 (Expansion): ユーザー体験を深化させる拡張機能。
【禁忌と突破口】： 誰もが『不可能だ』と思う壁と、それを突破するAI的なアプローチ。

A: ${a}, B: ${b}`;
}

export default function CombinePage() {
  const [inputA, setInputA] = useState("");
  const [inputB, setInputB] = useState("");
  const [result, setResult] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [copied, setCopied] = useState(false);

  const canGenerate = inputA.trim() !== "" && inputB.trim() !== "" && !analyzing;

  const handleGenerate = () => {
    if (!canGenerate) return;
    setAnalyzing(true);
    setResult("");
    setCopied(false);
    // 「解析中」の演出。静的サイトなので実処理はクライアント完結
    window.setTimeout(() => {
      setResult(buildPrompt(inputA.trim(), inputB.trim()));
      setAnalyzing(false);
    }, 1100);
  };

  const handleCopy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-1 flex-col overflow-hidden bg-black text-zinc-100">
      {/* 背景グリッド & グロー（トップページと共通の世界観） */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(34,211,238,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.35) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-lime-400/15 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 h-[360px] w-[360px] rounded-full bg-cyan-500/15 blur-[120px]"
      />

      <main className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 pb-24 pt-16 sm:pt-20">
        {/* ナビゲーション */}
        <Link
          href="/"
          className="group inline-flex w-fit items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-zinc-500 transition-colors hover:text-lime-300"
        >
          <span className="transition-transform group-hover:-translate-x-1">
            ←
          </span>
          Back to Lab
        </Link>

        {/* ヘッダー */}
        <div className="mt-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-lime-400/40 bg-lime-400/5 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.25em] text-lime-300">
            <span className="h-2 w-2 animate-pulse rounded-full bg-lime-400 shadow-[0_0_10px_2px_rgba(163,230,53,0.8)]" />
            EXP-001 / Idea Combiner
          </span>

          <h1 className="mt-6 bg-gradient-to-b from-white via-white to-lime-200/80 bg-clip-text text-4xl font-black uppercase tracking-tight text-transparent drop-shadow-[0_0_30px_rgba(163,230,53,0.3)] sm:text-5xl">
            Prompt Combiner
          </h1>

          <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-400">
            2つの異なる要素を掛け合わせ、AIに投げ込むための
            <span className="text-lime-300"> 最高にエッジの効いたプロンプト </span>
            を抽出します。生成結果をコピーして Claude や ChatGPT に貼り付けてください。
          </p>
        </div>

        {/* 入力フォーム */}
        <section className="mt-12 rounded-xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm sm:p-8">
          <div className="mb-6 flex items-center gap-4">
            <h2 className="font-mono text-sm uppercase tracking-[0.3em] text-cyan-400">
              // Input Elements
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-cyan-400/50 to-transparent" />
          </div>

          <div className="space-y-6">
            <div>
              <label
                htmlFor="input-a"
                className="mb-2 block font-mono text-xs uppercase tracking-[0.2em] text-lime-300"
              >
                A: 好きなこと・得意なこと
              </label>
              <input
                id="input-a"
                type="text"
                value={inputA}
                onChange={(e) => setInputA(e.target.value)}
                placeholder="例：クレーンゲーム、盆栽"
                className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-3 font-mono text-sm text-zinc-100 placeholder:text-zinc-600 transition-colors focus:border-lime-400/60 focus:outline-none focus:ring-1 focus:ring-lime-400/40"
              />
            </div>

            <div>
              <label
                htmlFor="input-b"
                className="mb-2 block font-mono text-xs uppercase tracking-[0.2em] text-cyan-300"
              >
                B: 全く関係ない単語・ニッチな分野
              </label>
              <input
                id="input-b"
                type="text"
                value={inputB}
                onChange={(e) => setInputB(e.target.value)}
                placeholder="例：量子力学、地方の珍味"
                className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-3 font-mono text-sm text-zinc-100 placeholder:text-zinc-600 transition-colors focus:border-cyan-400/60 focus:outline-none focus:ring-1 focus:ring-cyan-400/40"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={!canGenerate}
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-lime-400/60 bg-lime-400/10 px-6 py-3.5 font-mono text-sm font-bold uppercase tracking-[0.2em] text-lime-300 transition-all hover:bg-lime-400/20 hover:shadow-[0_0_30px_-4px_rgba(163,230,53,0.6)] disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/[0.02] disabled:text-zinc-600 disabled:shadow-none"
          >
            {analyzing ? (
              <>
                <span className="h-2 w-2 animate-ping rounded-full bg-lime-400" />
                Combining Elements...
              </>
            ) : (
              <>
                <span className="text-lg leading-none">⚡</span>
                Generate Prompt
              </>
            )}
          </button>
        </section>

        {/* 解析中の演出 */}
        {analyzing && (
          <p className="mt-6 animate-pulse text-center font-mono text-xs uppercase tracking-[0.3em] text-cyan-400">
            Analyzing combination<span className="tracking-normal">...</span>
          </p>
        )}

        {/* 結果表示（抽出された秘密のレシピ） */}
        {result && !analyzing && (
          <section className="mt-12">
            <div className="mb-4 flex items-center gap-4">
              <h2 className="font-mono text-sm uppercase tracking-[0.3em] text-lime-400">
                // Extracted Recipe
              </h2>
              <div className="h-px flex-1 bg-gradient-to-r from-lime-400/50 to-transparent" />
            </div>

            <div className="relative rounded-xl border border-lime-400/50 bg-lime-400/[0.03] p-6 shadow-[0_0_40px_-8px_rgba(163,230,53,0.5)] sm:p-8">
              <div
                aria-hidden
                className="absolute right-4 top-4 font-mono text-[10px] tracking-widest text-lime-400/60"
              >
                SECRET
              </div>
              <pre className="mt-2 max-h-[55vh] overflow-y-auto whitespace-pre-wrap break-words pr-2 font-mono text-sm leading-relaxed text-zinc-200">
                {result}
              </pre>

              <button
                type="button"
                onClick={handleCopy}
                className="mt-6 inline-flex items-center gap-2 rounded-lg border border-cyan-400/50 bg-cyan-400/10 px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.2em] text-cyan-300 transition-all hover:bg-cyan-400/20 hover:shadow-[0_0_20px_-4px_rgba(34,211,238,0.6)]"
              >
                {copied ? "✓ Copied!" : "Copy to Clipboard"}
              </button>
            </div>

            <p className="mt-4 font-mono text-xs leading-relaxed text-zinc-600">
              ↑ このプロンプトをコピーして Claude / ChatGPT
              に貼り付けると、ビジネスアイデアやツール案が生成されます。
            </p>
          </section>
        )}
      </main>

      {/* フッター */}
      <footer className="relative z-10 border-t border-white/10 py-8">
        <p className="text-center font-mono text-sm tracking-widest text-zinc-500">
          © 2026 Chizmo
        </p>
      </footer>
    </div>
  );
}
