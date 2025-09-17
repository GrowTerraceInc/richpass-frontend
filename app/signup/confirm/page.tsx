// app/signup/confirm/page.tsx
import type { Metadata } from "next";
import RegistrationConfirm from "../components/RegistrationConfirm";

type PageProps = {
  searchParams: {
    nickname?: string;
    email?: string;
  };
};

export const metadata: Metadata = {
  title: "登録内容の確認 | リッチパス",
  description: "登録フォームで入力した内容を確認します。",
};

export default function Page({ searchParams }: PageProps) {
  // クエリから表示用の値を受け取り（未指定時はサンプル）
  const nickname = searchParams.nickname ?? "大地";
  const email = searchParams.email ?? "daichi@example.com";

  return <RegistrationConfirm nickname={nickname} email={email} />;
}
