import type { Metadata } from 'next';
import LoginContent from './LoginContent';

export const metadata: Metadata = {
  title: 'ログイン | リッチパス',
  description: 'アカウントにログインします。',
};

export default function Page({
  searchParams,
}: {
  searchParams: { next?: string; success?: string };
}) {
  // /login?next=/home のような遷移先指定（未指定は /home）
  const nextPath = searchParams?.next ? decodeURIComponent(searchParams.next) : '/home';
  // /login?success=password-updated でバナー表示
  const successParam = searchParams?.success;

  return <LoginContent nextPath={nextPath} successParam={successParam} />;
}
