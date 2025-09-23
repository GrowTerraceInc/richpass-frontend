// src/app/home/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import HomeScreen from './components/HomeScreen';

export default function HomePage() {
  const { user, loading, refresh, doLogout } = useAuth();
  const [retriedOnce, setRetriedOnce] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // まだ /api/me の評価中
    if (loading) return;

    // 認証済みなら表示
    if (user) return;

    // 初回だけ /api/me を明示再同期（Cookie伝播のレース吸収）
    if (!retriedOnce) {
      setRetriedOnce(true);
      void refresh();
      return;
    }

    // それでも未ログインなら /login へ
    router.replace('/login');
  }, [loading, user, refresh, retriedOnce, router]);

  if (loading) return <p className="p-6">読み込み中…</p>;
  if (!user) return null; // 上の useEffect が遷移を担当

  return (
    <>
      <HomeScreen />
      {/* E2E 用の安定導線（任意） */}
      <div className="container container--sm py-4">
        <button
          data-testid="logout-btn"
          onClick={async () => {
            await doLogout();
            router.replace('/login');
          }}
          className="mt-6 px-4 py-2 rounded-lg bg-[var(--color-gray-900)] text-white"
        >
          ログアウト
        </button>
      </div>
    </>
  );
}
