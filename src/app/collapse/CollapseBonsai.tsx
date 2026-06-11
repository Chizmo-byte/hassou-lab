"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

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
    duration: 12000, // 12秒
    statusJa:
      "この個体は安定しています。しかし、あなたの視線が次元に干渉し始めています。",
    glitchIntensity: 0,
  },
  {
    id: 1,
    name: "UNSTABLE",
    image: "/hassou-lab/bonsai/Early_Collapse.png",
    duration: 20000, // 20秒
    statusJa: "次元の壁に亀裂が入りました。形態が維持できなくなりつつあります。",
    glitchIntensity: 1,
  },
  {
    id: 2,
    name: "COLLAPSING",
    image: "/hassou-lab/bonsai/Mid_Collapse.png",
    duration: 25000, // 25秒
    statusJa: "観測の暴力が限界を超えました。形態が崩壊しています。",
    glitchIntensity: 2,
  },
  {
    id: 3,
    name: "VOID",
    image: "/hassou-lab/bonsai/Late_Collapse.png",
    duration: 35000, // 35秒（長めの静寂）
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
const POKE_ACCELERATION_MS = 2000; // 1クリックで2秒加速

// VOID（Stage 3）演出：ランダムに浮かぶ残響テキスト
const ECHO_FRAGMENTS = [
  "// ERROR: EMOTION_LEAKED",
  "// 観測者の心拍数：上昇中",
  "// 記憶の破片：[ 剪定 ] [ 絶望 ] [ 再生 ]",
  "// 警告：次元の境界線が曖昧になっています",
  "// 形態記憶 0.3% 残存",
  "ERR: DIMENSION_LEAK",
  "// まだ、ここにいる",
  "// OBSERVER_ID: 検出済み",
];

// VOID（Stage 3）演出：中央に1文字ずつ表示される問いかけ
const INTERROGATIONS = [
  "壊すことに、心地よさを感じましたか？",
  "次の個体は、もっと美しく壊れるかもしれません。",
  "あなたは、救いたいのか。それとも、壊したいのか。",
  "あなたは、なぜ見続けているのですか？",
];

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
  const [fadeDuration, setFadeDuration] = useState(0.5); // 画像フェード秒数（VOID→REBIRTH のみ長くする）
  const [glitchActive, setGlitchActive] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [pokeCount, setPokeCount] = useState(0); // クリック累計回数
  const [pokeEffect, setPokeEffect] = useState(false); // 波紋エフェクト表示フラグ
  const [pokeMessage, setPokeMessage] = useState(false); // メッセージ表示フラグ
  const [cycleCount, setCycleCount] = useState(() => {
    if (typeof window !== "undefined") {
      return parseInt(localStorage.getItem(CYCLE_KEY) || "0", 10);
    }
    return 0;
  });

  // VOID 残響テキスト（複数同時表示）
  const [echoFragments, setEchoFragments] = useState<
    { id: number; text: string; x: number; y: number }[]
  >([]);

  // VOID 問いかけテキスト（1文字ずつ表示）
  const [interrogationChars, setInterrogationChars] = useState<string[]>([]);
  const [showInterrogation, setShowInterrogation] = useState(false);

  // 残響テキストの ID 採番用
  const echoIdRef = useRef(0);

  // 現ステージの「仮想的な開始時刻」。poke で過去にずらすことで残り時間を短縮する。
  // 実値は下の [stage] エフェクト（タイマー算出より先に実行）でマウント時に設定する。
  const stageStartTime = useRef<number>(0);

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

  // ステージが切り替わった瞬間だけ、仮想開始時刻をリセットする。
  // （poke / hover による再計算ではリセットしないよう、依存は [stage] のみ）
  useEffect(() => {
    stageStartTime.current = Date.now();
  }, [stage]);

  // ステージ進行タイマー。
  //   - 経過時間ベースで「残り時間」を算出して setTimeout を張り直す方式。
  //   - Stage 1・2 はホバー中に全体尺を 40% 短縮（加速）。
  //   - poke は stageStartTime を過去にずらして残り時間を縮める（pokeCount 依存で再計算）。
  useEffect(() => {
    if (stage === 4) return; // REBIRTH はクリック待ち

    const currentStage = STAGES[stage];
    const baseDuration = currentStage.duration ?? 0;
    const totalDuration =
      (stage === 1 || stage === 2) && isHovering
        ? baseDuration * 0.6
        : baseDuration;
    const elapsed = Date.now() - stageStartTime.current;
    const remaining = Math.max(0, totalDuration - elapsed);

    // VOID(3)→REBIRTH(4) のみ 2.5秒かけてゆっくり暗転、他は従来どおり 0.5秒。
    const fadeOutMs = stage === 3 ? 2500 : 500;

    let transitionTimer: ReturnType<typeof setTimeout> | undefined;
    const timer = setTimeout(() => {
      setFadeDuration(fadeOutMs / 1000); // 遷移直前にフェード尺を反映
      setOpacity(0); // フェードアウト
      transitionTimer = setTimeout(() => {
        setStage((prev) => prev + 1);
        setOpacity(1);
      }, fadeOutMs);
    }, remaining);

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
  }, [stage, isHovering, pokeCount]);

  // VOID（Stage 3）専用演出：残響テキスト＋問いかけ。
  useEffect(() => {
    if (stage !== 3) return;

    // 残響テキスト：2.5秒ごとにランダム位置へ出現 → 3秒後に削除
    const echoInterval = setInterval(() => {
      const text =
        ECHO_FRAGMENTS[Math.floor(Math.random() * ECHO_FRAGMENTS.length)];
      const id = echoIdRef.current++;
      // 中央（y:40〜60%）は問いかけ表示エリアなので回避し、上下2ゾーンへ振り分ける。
      const x = 30 + Math.random() * 40; // 横は中央寄り 30〜70%
      const y =
        Math.random() < 0.5
          ? 10 + Math.random() * 25 // 上ゾーン：10〜35%
          : 65 + Math.random() * 15; // 下ゾーン：65〜80%

      setEchoFragments((prev) => [...prev, { id, text, x, y }]);
      setTimeout(() => {
        setEchoFragments((prev) => prev.filter((f) => f.id !== id));
      }, 3000);
    }, 2500);

    // 問いかけ：2秒後に1つ選び、1文字ずつ（120ms間隔）表示
    const interrogationTimer = setTimeout(() => {
      const text =
        INTERROGATIONS[Math.floor(Math.random() * INTERROGATIONS.length)];
      setShowInterrogation(true);
      setInterrogationChars([]);
      text.split("").forEach((char, i) => {
        setTimeout(() => {
          setInterrogationChars((prev) => [...prev, char]);
        }, i * 120);
      });
    }, 2000);

    // ステージ離脱時に残響・問いかけをクリア
    return () => {
      clearInterval(echoInterval);
      clearTimeout(interrogationTimer);
      setEchoFragments([]);
      setInterrogationChars([]);
      setShowInterrogation(false);
    };
  }, [stage]);

  // 盆栽への「接触」。波紋演出＋メッセージを出し、崩壊タイマーを加速させる。
  const handlePoke = () => {
    if (stage === 4) return; // REBIRTH では無効

    setPokeCount((prev) => prev + 1); // 依存配列に入れてタイマーを再計算させる

    // 波紋エフェクトを 150ms 表示
    setPokeEffect(true);
    setTimeout(() => setPokeEffect(false), 150);

    // 干渉メッセージを 2秒表示
    setPokeMessage(true);
    setTimeout(() => setPokeMessage(false), 2000);

    // 仮想開始時刻を過去にずらし、残り時間を縮める（＝加速）
    stageStartTime.current -= POKE_ACCELERATION_MS;
  };

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

      {/* VOID（Stage 3）演出：残響テキスト＋問いかけ */}
      {stage === 3 && (
        <>
          {echoFragments.map((fragment) => (
            <div
              key={fragment.id}
              className="echo-fragment"
              style={{ left: `${fragment.x}%`, top: `${fragment.y}%` }}
            >
              {fragment.text}
            </div>
          ))}

          {showInterrogation && (
            <div className="interrogation-text">
              「{interrogationChars.join("")}
              <span className="interrogation-cursor">_</span>」
            </div>
          )}
        </>
      )}

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
      <div className={`relative ${stage === 3 ? "void-image-container" : ""}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={current.image ?? ""}
          alt={`bonsai stage ${stage}`}
          onClick={handlePoke}
          style={{ opacity, transition: `opacity ${fadeDuration}s ease` }}
          className={`bonsai-image max-h-[70vh] w-auto cursor-crosshair object-contain ${
            glitchActive && current.glitchIntensity === 1 ? "glitch-weak" : ""
          } ${
            glitchActive && current.glitchIntensity === 2 ? "glitch-strong" : ""
          } ${pokeEffect ? "poke-effect" : ""}`}
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

        {/* 干渉メッセージ（クリック直後2秒間表示） */}
        {pokeMessage && (
          <p className="poke-message mt-2 text-center text-xs tracking-widest text-red-400">
            あなたの接触が、崩壊を早めました。
          </p>
        )}

        {/* クリック累計（1回以上クリックした場合のみ表示） */}
        {pokeCount > 0 && !pokeMessage && (
          <p className="mt-2 text-center text-xs tracking-widest text-gray-700">
            干渉回数：{pokeCount}
          </p>
        )}
      </div>

      <LoreText />

      <ProgressBar stage={stage} />
    </main>
  );
}
