'use client';

import React, { ReactNode, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useAuth } from './useAuth';

type RequiredMode = 'auth' | 'guest' | 'any';

// 型依存を避けるため、検索文字列（string）だけを受け取るユーティリティに変更
function buildCurrentUrl(pathname: string, searchString: string) {
  return searchString ? `${pathname}?${searchString}` : pathname;
}

/**
 * 認可境界：
 * - required="auth"  : 未認証なら /login?next=... へ
 * - required="guest" : 認証済みなら /home へ
 * - required="any"   : だれでもOK
 *
 * user === undefined は「ローディング」なので fallback を表示（FOUC抑制）
 */
export function AuthBoundary({
  required = 'any',
  fallback = null,
  children,
}: {
  required?: RequiredMode;
  fallback?: ReactNode;
  children: ReactNode;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams(); // ReadonlyURLSearchParams（型名に依存しない）
  const searchString = searchParams?.toString() ?? '';

  useEffect(() => {
    if (user === undefined) return; // 初期ロード中は判断しない
    const current = buildCurrentUrl(pathname, searchString);

    if (required === 'auth' && user === null) {
      // 未認証→ログインへ（復帰用next付き）
      router.replace(`/login?next=${encodeURIComponent(current)}`);
      return;
    }
    if (required === 'guest' && user && typeof user.id === 'number') {
      // 認証済みがゲストページへ来た→/home
      router.replace('/home');
      return;
    }
    // required === 'any' はなにもしない
  }, [user, required, pathname, searchString, router]);

  if (user === undefined) return <>{fallback}</>; // ローディング表示
  return <>{children}</>;
}
