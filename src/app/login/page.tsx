import type { Metadata } from 'next';
import LoginContent from './LoginContent';

export const metadata: Metadata = {
  title: 'ログイン | リッチパス',
  description: 'アカウントにログインします。',
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; success?: string }>;
}) {
  const sp = await searchParams;
  const nextPath = sp?.next ? decodeURIComponent(sp.next) : '/home';
  const successParam = sp?.success;

  return <LoginContent nextPath={nextPath} successParam={successParam} />;
}
