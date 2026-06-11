import Link from "next/link";

const experiments = [
  {
    code: "EXP-001",
    title: "ニッチ掛け合わせ思考機",
    desc: "2つの異なる要素を掛け合わせ、最高にエッジの効いたプロンプトを生成する。",
    href: "/combine",
    status: "active" as const,
  },
  {
    code: "EXP-002",
    title: "COLLAPSE BONSAI",
    desc: "観測することが、破壊になる。",
    href: "/collapse",
    status: "active" as const,
  },
  {
    code: "EXP-003",
    title: "Coming Soon...",
    desc: "不気味で予測不能なジェネレーターを開発中。期待していてください。",
  },
  {
    code: "EXP-004",
    title: "Coming Soon...",
    desc: "まだ名前すらない実験。最高にエキサイティングな何か。",
  },
];

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-1 flex-col overflow-hidden bg-black text-zinc-100">
      {/* 背景グリッド & グロー */}
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
        className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-cyan-500/20 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 h-[360px] w-[360px] rounded-full bg-lime-400/15 blur-[120px]"
      />

      {/* ヒーローセクション */}
      <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col items-center px-6 pb-24 pt-28 text-center sm:pt-36">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-400/5 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.25em] text-cyan-300">
          <span className="h-2 w-2 animate-pulse rounded-full bg-lime-400 shadow-[0_0_10px_2px_rgba(163,230,53,0.8)]" />
          Digital Experiment Lab
        </span>

        <h1 className="bg-gradient-to-b from-white via-white to-cyan-200/80 bg-clip-text text-6xl font-black uppercase tracking-tight text-transparent drop-shadow-[0_0_30px_rgba(34,211,238,0.35)] sm:text-8xl">
          Hassou Lab
        </h1>

        <p className="mt-8 max-w-2xl text-balance text-xl font-semibold text-lime-300 drop-shadow-[0_0_18px_rgba(163,230,53,0.35)] sm:text-2xl">
          常識を壊し、AIで『新しい面白さ』を生成する。
        </p>

        <p className="mt-4 max-w-xl text-balance text-base leading-relaxed text-zinc-400 sm:text-lg">
          不気味で、奇妙で、最高にエキサイティングな実験場へようこそ。
        </p>

        {/* 実験ツール・ギャラリー */}
        <section className="mt-24 w-full">
          <div className="mb-8 flex items-center gap-4">
            <h2 className="font-mono text-sm uppercase tracking-[0.3em] text-cyan-400">
              // Experiment Gallery
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-cyan-400/50 to-transparent" />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {experiments.map((exp) => {
              const isActive = exp.status === "active";

              const cardBody = (
                <>
                  <div
                    aria-hidden
                    className={`absolute right-4 top-4 font-mono text-[10px] tracking-widest transition-colors ${
                      isActive
                        ? "text-lime-400"
                        : "text-zinc-600 group-hover:text-lime-400"
                    }`}
                  >
                    {exp.code}
                  </div>
                  <div
                    className={`mb-5 flex h-12 w-12 items-center justify-center rounded-lg border bg-black/40 font-mono text-xl transition-all ${
                      isActive
                        ? "border-lime-400/60 text-lime-300"
                        : "border-cyan-400/30 text-cyan-300 group-hover:border-lime-400/60 group-hover:text-lime-300"
                    }`}
                  >
                    {isActive ? "⚡" : "?"}
                  </div>
                  <h3
                    className={`text-lg font-bold transition-colors ${
                      isActive
                        ? "text-lime-300"
                        : "text-zinc-100 group-hover:text-cyan-300"
                    }`}
                  >
                    {exp.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                    {exp.desc}
                  </p>
                  {isActive ? (
                    <div className="mt-5 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-lime-400">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lime-400 shadow-[0_0_8px_2px_rgba(163,230,53,0.8)]" />
                      Status: Active →
                    </div>
                  ) : (
                    <div className="mt-5 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-zinc-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-zinc-600 group-hover:animate-pulse group-hover:bg-lime-400" />
                      Status: Incubating
                    </div>
                  )}
                </>
              );

              if (isActive && exp.href) {
                return (
                  <Link
                    key={exp.code}
                    href={exp.href}
                    className="group relative overflow-hidden rounded-xl border border-lime-400/50 bg-lime-400/[0.04] p-6 text-left backdrop-blur-sm shadow-[0_0_30px_-8px_rgba(163,230,53,0.5)] transition-all duration-300 hover:-translate-y-1 hover:border-lime-400/80 hover:bg-lime-400/[0.08] hover:shadow-[0_0_36px_-4px_rgba(163,230,53,0.7)]"
                  >
                    {cardBody}
                  </Link>
                );
              }

              return (
                <article
                  key={exp.code}
                  className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] p-6 text-left backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/60 hover:bg-cyan-400/[0.04] hover:shadow-[0_0_30px_-5px_rgba(34,211,238,0.4)]"
                >
                  {cardBody}
                </article>
              );
            })}
          </div>
        </section>
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
