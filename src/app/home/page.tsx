// src/app/home/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import HomeScreen from './components/HomeScreen';

export default function HomePage() {
  const { user, loading, refresh, } = useAuth();
  const [retriedOnce, setRetriedOnce] = useState(false);
  const router = useRouter();

  // ガード：初回だけ refresh を挟んでから判断（Cookieレース吸収）
  useEffect(() => {
    if (loading) return;        // /api/me 評価中
    if (user) return;           // 認証済みなら何もしない

    if (!retriedOnce) {
      setRetriedOnce(true);
      void refresh();
      return;
    }
    router.replace('/login');
  }, [loading, user, refresh, retriedOnce, router]);

  // ★ ここで常に home-root を返す（中身だけ切り替える）
  return (
    <section data-testid="home-root">
      {loading ? (
        <p className="p-6">読み込み中…</p>
      ) : user ? (
        <>
          <HomeScreen />
        </>
      ) : (
        // ここはリダイレクトまでの一瞬だけ表示される
        <p className="p-6">リダイレクト中…</p>
      )}
    </section>
  );
}
