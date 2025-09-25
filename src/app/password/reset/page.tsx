import type { Metadata } from 'next';
import ResetPasswordForm from './ResetPasswordForm';

export const metadata: Metadata = {
  title: '新しいパスワードの設定 | リッチパス',
  description: 'メールで届いたリンクから新しいパスワードを設定してください。',
};

export default function Page() {
  return (
    <div data-testid="reset-root">
      <ResetPasswordForm />
    </div>
  );
}
