// app/diagnosis/quiz/page.tsx
import type { Metadata } from "next";
import DiagnosisScreen from "../components/DiagnosisScreen";
import questions from "../questions.json"; // ← ここを修正！

export const metadata: Metadata = {
  title: "金銭性格診断 | クイズ",
  description: "全20問の診断に回答して、あなたの金銭性格をチェックしましょう。",
};

export default function Page() {
  return <DiagnosisScreen questions={questions} />;
}
