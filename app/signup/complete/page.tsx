// app/signup/complete/page.tsx
import type { Metadata } from "next";
import RegistrationComplete from "../components/RegistrationComplete";

export const metadata: Metadata = {
  title: "登録完了 | リッチパス",
  description: "アカウント登録が完了しました。診断結果を見て学習を始めましょう。",
};

export default function Page() {
  return <RegistrationComplete />;
}
