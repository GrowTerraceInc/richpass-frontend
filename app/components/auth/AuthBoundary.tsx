'use client';

import React, { ReactNode, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useAuth } from './useAuth';

type RequiredMode = 'auth' | 'guest' | 'any';

// 検索文字列は string に統一（型依存を避ける）
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
  const searchParams = useSearchParams();
  const searchString = searchParams?.toString() ?? '';

  useEffect(() => {
    if (user === undefined) return; // 初期ロード中は判断しない
    const current = buildCurrentUrl(pathname, searchString);

    if (required === 'auth' && user === null) {
      router.replace(`/login?next=${encodeURIComponent(current)}`);
      return;
    }
    if (required === 'guest' && user && typeof user.id === 'number') {
      router.replace('/home');
      return;
    }
    // required === 'any' は何もしない
  }, [user, required, pathname, searchString, router]);

  if (user === undefined) return <>{fallback}</>;
  return <>{children}</>;
}
