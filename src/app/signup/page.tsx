import type { Metadata } from 'next';
import RegistrationForm from './components/RegistrationForm';

export const metadata: Metadata = {
  title: 'アカウント登録 | リッチパス',
  description: '診断結果を見るために、無料でアカウント登録を行います。',
};

export default function Page() {
  return (
    <div data-testid="signup-root">
      <RegistrationForm />
    </div>
  );
}
