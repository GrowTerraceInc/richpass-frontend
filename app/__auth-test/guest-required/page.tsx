'use client';

import React from 'react';
import { AuthBoundary } from '@/app/components/auth/AuthBoundary';

export default function Page() {
  return (
    <AuthBoundary required="guest" fallback={<p>checking guest...</p>}>
      <div style={{ padding: 24 }}>
        <h1>Guest Required OK</h1>
        <p>このページはゲスト専用です。ログイン済みなら /home に送還されます。</p>
      </div>
    </AuthBoundary>
  );
}
