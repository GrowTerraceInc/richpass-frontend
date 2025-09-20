'use client';

import React from 'react';
import { AuthBoundary } from '@/app/components/auth/AuthBoundary';

export default function Page() {
  return (
    <AuthBoundary required="auth" fallback={<p>checking auth...</p>}>
      <div style={{ padding: 24 }}>
        <h1>Auth Required OK</h1>
        <p>あなたはログイン済みです（このページは認証必須）。</p>
      </div>
    </AuthBoundary>
  );
}
