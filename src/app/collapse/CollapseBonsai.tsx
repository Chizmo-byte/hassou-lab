"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// ページ最下部に常時表示するロアテキスト（/combine への物語的接続）。
function LoreText() {
  return (
    <div className="absolute bottom-6 left-0 right-0 z-10 px-8 text-center">
      <p className="text-xs leading-relaxed tracking-widest text-gray-600">
        この実験（EXP-002）は、
        <Link
          href="/combine"
          className="lore-link text-gray-500 underline underline-offset-4 transition-colors duration-300 hover:text-green-400"
        >
          ニッチ掛け合わせ思考機
        </Link>
        によって生み出された概念の、物質化である。
      </p>
    </div>
  );
}

// ステージ定義（指示書 EXP-002 §2 準拠）。
// 0〜3 は duration 経過で自動遷移、4(REBIRTH) はユーザーのクリック待ち。
const STAGES = [
  {
    id: 0,
    name: "OBSERVING",
    image: "/hassou-lab/bonsai/not_collapsed.png",
    duration: 6000, // 6秒
    statusJa:
      "この個体は安定しています。しかし、あなたの視線が次元に干渉し始めています。",
    glitchIntensity: 0,
  },
  {
    id: 1,
    name: "UNSTABLE",
    image: "/hassou-lab/bonsai/Early_Collapse.png",
    duration: 10000, // 10秒
    statusJa: "次元の壁に亀裂が入りました。形態が維持できなくなりつつあります。",
    glitchIntensity: 1,
  },
  {
    id: 2,
    name: "COLLAPSING",
    image: "/hassou-lab/bonsai/Mid_Collapse.png",
    duration: 15000, // 15秒
    statusJa: "観測の暴力が限界を超えました。形態が崩壊しています。",
    glitchIntensity: 2,
  },
  {
    id: 3,
    name: "VOID",
    image: "/hassou-lab/bonsai/Late_Collapse.png",
    duration: 10000, // 10秒（長めの静寂）
    statusJa: "個体は消滅しました。あとに残ったのは、次元の記憶だけです。",
    glitchIntensity: 0,
  },
  {
    id: 4,
    name: "REBIRTH",
    image: null, // 画像なし・種のみ表示
    duration: null, // ユーザーのクリック待ち
    statusJa: null,
    glitchIntensity: 0,
  },
] as const;

const CYCLE_KEY = "bonsai-cycle-count";

function ProgressBar({ stage }: { stage: number }) {
  if (stage === 4) return null;
  const progress = (stage / 3) * 100;
  return (
    <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-900">
      <div
        className="h-full bg-green-500 transition-all duration-1000"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

export default function CollapseBonsai() {
  const [stage, setStage] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const [glitchActive, setGlitchActive] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [cycleCount, setCycleCount] = useState(() => {
    if (typeof window !== "undefined") {
      return parseInt(localStorage.getItem(CYCLE_KEY) || "0", 10);
    }
    return 0;
  });

  // 4枚をマウント時にプリロードしてステージ遷移時のチラつきを防ぐ。
  // ※ next/image は使わず、ブラウザ標準の Image を利用する。
  useEffect(() => {
    const imageUrls = [
      "/hassou-lab/bonsai/not_collapsed.png",
      "/hassou-lab/bonsai/Early_Collapse.png",
      "/hassou-lab/bonsai/Mid_Collapse.png",
      "/hassou-lab/bonsai/Late_Collapse.png",
    ];
    imageUrls.forEach((url) => {
      const img = new window.Image();
      img.src = url;
    });
  }, []);

  // ステージ進行タイマー。Stage 1・2 はホバー中に 40% 加速する。
  useEffect(() => {
    if (stage === 4) return; // REBIRTH はクリック待ち

    const currentStage = STAGES[stage];
    const baseDuration = currentStage.duration ?? 0;
    const effectiveDuration =
      (stage === 1 || stage === 2) && isHovering
        ? baseDuration * 0.6
        : baseDuration;

    let transitionTimer: ReturnType<typeof setTimeout> | undefined;
    const timer = setTimeout(() => {
      setOpacity(0); // フェードアウト
      transitionTimer = setTimeout(() => {
        setStage((prev) => prev + 1);
        setOpacity(1);
      }, 500);
    }, effectiveDuration);

    // グリッチエフェクト（Stage 1・2 のみ）
    let glitchInterval: ReturnType<typeof setInterval> | undefined;
    if (currentStage.glitchIntensity > 0) {
      const interval = currentStage.glitchIntensity === 1 ? 3000 : 800;
      glitchInterval = setInterval(() => {
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 150);
      }, interval);
    }

    // クリーンアップ（メモリリーク防止）
    return () => {
      clearTimeout(timer);
      if (transitionTimer) clearTimeout(transitionTimer);
      if (glitchInterval) clearInterval(glitchInterval);
    };
  }, [stage, isHovering]);

  const handleRebirth = () => {
    const newCount = cycleCount + 1;
    setCycleCount(newCount);
    if (typeof window !== "undefined") {
      localStorage.setItem(CYCLE_KEY, String(newCount));
    }
    setStage(0);
    setOpacity(1);
    setGlitchActive(false);
  };

  // ── Stage 4：REBIRTH ──────────────────────────────
  if (stage === 4) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center bg-black">
        {/* ナビゲーション */}
        <div className="absolute left-6 top-4 z-20">
          <Link
            href="/"
            className="back-to-lab-link text-xs tracking-widest text-gray-500 transition-colors duration-300 hover:text-green-400"
          >
            ← Back to Lab
          </Link>
        </div>

        <p className="mb-2 text-sm tracking-widest text-green-400 opacity-70">
          本当に、また観測しますか？
        </p>

        <p className="mb-16 text-xs tracking-widest text-gray-600">
          {cycleCount > 0
            ? `この個体は${cycleCount}度目の観測による崩壊を経験しました。`
            : "はじめての崩壊でした。"}
        </p>

        <div
          className="seed h-8 w-8 rounded-full bg-green-400"
          onClick={handleRebirth}
          role="button"
          tabIndex={0}
          aria-label="新しい種を植える"
          onKeyDown={(e) => e.key === "Enter" && handleRebirth()}
        />

        <p className="mt-8 text-xs tracking-widest text-green-500 opacity-60">
          A new seed has materialized. Click to plant it.
        </p>

        <LoreText />
      </div>
    );
  }

  // ── Stage 0〜3：観測・崩壊 ─────────────────────────
  const current = STAGES[stage];

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black">
      {/* ナビゲーション */}
      <div className="absolute left-6 top-4 z-20">
        <Link
          href="/"
          className="back-to-lab-link text-xs tracking-widest text-gray-500 transition-colors duration-300 hover:text-green-400"
        >
          ← Back to Lab
        </Link>
      </div>

      {/* ステータスバー（上部） */}
      <div className="absolute left-0 right-0 top-8 z-10 text-center">
        <p className="text-xs tracking-[0.3em] text-green-400">
          STATUS: {current.name}
        </p>
        {cycleCount > 0 && stage === 0 && (
          <p className="mt-1 text-xs tracking-widest text-gray-600">
            観測回数 / OBSERVATION: {cycleCount + 1}
          </p>
        )}
      </div>

      {/* メイン画像エリア */}
      <div
        className={`relative ${stage === 3 ? "stage-void" : ""}`}
        style={{ opacity, transition: "opacity 0.5s ease" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={current.image ?? ""}
          alt={`bonsai stage ${stage}`}
          className={`bonsai-image max-h-[70vh] w-auto object-contain ${
            glitchActive && current.glitchIntensity === 1 ? "glitch-weak" : ""
          } ${
            glitchActive && current.glitchIntensity === 2 ? "glitch-strong" : ""
          }`}
          onMouseEnter={() =>
            (stage === 1 || stage === 2) && setIsHovering(true)
          }
          onMouseLeave={() => setIsHovering(false)}
        />
      </div>

      {/* ステータステキスト（下部） */}
      <div className="absolute bottom-20 left-0 right-0 z-10 px-8 text-center">
        <p className="mx-auto max-w-lg text-sm leading-relaxed text-gray-400">
          {isHovering && stage === 1 && "あなたの視線が、崩壊を加速させています。"}
          {isHovering && stage === 2 && "もう、止まらない。"}
          {!isHovering && current.statusJa}
        </p>
      </div>

      <LoreText />

      <ProgressBar stage={stage} />
    </main>
  );
}
