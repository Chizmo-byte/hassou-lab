import type { Metadata } from "next";
import CollapseBonsai from "./CollapseBonsai";

// metadata は Server Component からのみ export できるため、
// インタラクション本体は client の <CollapseBonsai /> に分離している。
export const metadata: Metadata = {
  title: "COLLAPSE BONSAI | 発想ラボ",
  description: "観測することが、破壊になる。次元崩壊盆栽。",
};

export default function CollapsePage() {
  return <CollapseBonsai />;
}
