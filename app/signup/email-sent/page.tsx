// app/signup/email-sent/page.tsx
import type { Metadata } from "next";
import EmailSent from "../components/EmailSent";

export const metadata: Metadata = {
  title: "メールをご確認ください | リッチパス",
  description:
    "アカウント有効化メールを送信しました。メール内のリンクから登録を完了してください。",
};

export default function Page() {
  // 画面確認用のダミー。実運用では onResend でAPI呼び出し or resendHref で遷移させてください。
  return <EmailSent resendHref="/signup/resend" />;
}