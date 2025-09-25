import type { Metadata } from 'next';
import RegistrationComplete from '../components/RegistrationComplete';
import VerifyGate from './VerifyGate';

export const metadata: Metadata = {
  title: '登録完了 | リッチパス',
  description: 'アカウント登録が完了しました。診断結果を見て学習を始めましょう。',
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ verified?: string }>;
}) {
  const sp = await searchParams;
  const verified = sp?.verified === '1';

  return (
    <main data-testid="verify-root">
      <VerifyGate verified={verified} />
      <RegistrationComplete />
    </main>
  );
}
