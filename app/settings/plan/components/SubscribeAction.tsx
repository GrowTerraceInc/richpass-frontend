'use client';

import { useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_ORIGIN!;

export default function SubscribeAction() {
  const [loading, setLoading] = useState(false);

  async function handleSubscribe() {
    try {
      setLoading(true);
      // 直接ナビゲーション（CORSを介さない）
      window.location.href = `${API}/api/subscribe/redirect`;
    } finally {
      // 実際は遷移するので見えないが念のため
      setLoading(false);
    }
  }

  return (
    <div style={{display:'grid', gap:8}}>
      <button
        onClick={handleSubscribe}
        disabled={loading}
        style={{ padding:'10px 16px', fontSize:16 }}
      >
        {loading ? '処理中…' : 'プレミアムにアップグレード'}
      </button>
    </div>
  );
}
