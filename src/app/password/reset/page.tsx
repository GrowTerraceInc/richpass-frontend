import type { Metadata } from 'next';
import ResetPasswordForm from './ResetPasswordForm';

export const metadata: Metadata = {
  title: '新しいパスワードの設定 | リッチパス',
  description: 'メールで届いたリンクから新しいパスワードを設定してください。',
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; email?: string }>;
}) {
  const sp = await searchParams;
  const token = sp?.token ?? '';
  const email = sp?.email ?? '';

  return (
    <div data-testid="reset-root">
      <ResetPasswordForm token={token} email={email} />
    </div>
  );
}
