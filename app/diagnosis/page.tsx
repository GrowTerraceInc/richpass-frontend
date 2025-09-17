// app/diagnosis/page.tsx
import type { Metadata } from "next";

import HeroSection from "./components/HeroSection";
import MeritSection from "./components/MeritSection";
import MethodSection from "./components/MethodSection";
import CharacterShowcaseSection from "./components/CharacterShowcaseSection";
import FAQSection from "./components/FAQSection";
import FinalCTASection from "./components/FinalCTASection";

export const metadata: Metadata = {
  title: "金銭性格診断 | リッチパス",
  description:
    "簡単な質問に答えるだけで、あなたの金銭感覚の強み・弱み、向いている資産運用スタイル、学習ロードマップが分かります。",
};

export default function DiagnosisPage() {
  // ルートの layout.tsx で <main> が定義されている想定のため、ここではラップしません
  return (
    <>
      <HeroSection />
      <MeritSection />
      <MethodSection />
      <CharacterShowcaseSection />
      <FAQSection />
      <FinalCTASection />
    </>
  );
}
