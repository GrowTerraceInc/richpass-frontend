import type { Metadata } from 'next';
import EmailSentScreen from './EmailSentScreen';

export const metadata: Metadata = {
  title: 'メールをご確認ください | リッチパス',
  description: 'アカウント有効化メールを送信しました。メール内のリンクから登録を完了してください。',
};

export default function Page() {
  return (
    <div data-testid="email-sent-root">
      <EmailSentScreen />
    </div>
  );
}
