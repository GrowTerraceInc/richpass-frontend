// app/diagnosis/promo/page.tsx
import type { Metadata } from "next";
import RegistrationPromo from "../components/RegistrationPromo";

export const metadata: Metadata = {
  title: "分析完了 | アカウント登録で結果を表示",
  description:
    "診断結果の表示前に、無料のアカウント登録でより良い体験をご案内します。",
};

export default function Page() {
  return <RegistrationPromo />;
}
