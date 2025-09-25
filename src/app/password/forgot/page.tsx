import type { Metadata } from 'next';
import ForgotPasswordForm from './ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'パスワードの再設定 | リッチパス',
  description: 'ご登録のメールアドレス宛に再設定用リンクをお送りします。',
};

export default function Page() {
  return (
    <div data-testid="forgot-root">
      <ForgotPasswordForm />
    </div>
  );
}
