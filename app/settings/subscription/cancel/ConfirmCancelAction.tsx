// app/settings/subscription/cancel/ConfirmCancelAction.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { csrfCookie } from '@/app/lib/authClient';
import { getSubscriptionStatusApi } from '@/app/lib/billingClient';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;

function getXsrfFromCookie(): string | null {
  if (typeof document === 'undefined') return null;
  const raw = document.cookie.split('; ').find((s) => s.startsWith('XSRF-TOKEN='));
  if (!raw) return null;
  try {
    return decodeURIComponent(raw.split('=')[1] ?? '');
  } catch {
    return raw.split('=')[1] ?? null;
  }
}

export default function ConfirmCancelAction({
  className,
  label = '解約を確定する',
}: {
  className?: string;
  label?: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onConfirm() {
    setErr(null);
    setPending(true);
    try {
      // 1) CSRF cookie
      const c = await csrfCookie();
      if (![200, 204].includes(c)) throw new Error(`CSRF failed: ${c}`);
      const xsrf = getXsrfFromCookie();
      if (!xsrf) throw new Error('CSRF token missing');

      // 2) POST /api/subscription/cancel
      const r = await fetch(`${API_BASE}/api/subscription/cancel`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': xsrf,
        },
        // 既定は「期間末で解約する」を想定（必要なら body に { at: 'now' } 等を追加予定）
        body: JSON.stringify({}),
      });
      if (!r.ok) {
        let msg = `Cancel failed: ${r.status}`;
        try {
          const j = await r.json();
          if (j?.error) msg = j.error;
        } catch {}
        throw new Error(msg);
      }

      // 3) 成功後の遷移先を決める（/status を再取得して at/end or now を判定）
      let at: 'end' | 'now' = 'end';
      let renew: string | null = null;
      try {
        const s = await getSubscriptionStatusApi();
        // 直ちにキャンセルされた場合は 'now'
        if (String(s.status).toLowerCase() === 'canceled') at = 'now';
        if (s.renews_at) renew = s.renews_at;
      } catch {
        // 取得失敗時はデフォルト（at=end）で遷移
      }

      const params = new URLSearchParams();
      params.set('at', at);
      if (renew) params.set('renew', renew);
      router.push(`/settings/subscription/cancel/success?${params.toString()}`);
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setPending(false);
    }
  }

  return (
    <div className={className}>
      {err && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-red-700 text-sm mb-3">
          {err}
        </div>
      )}
      <button
        onClick={onConfirm}
        disabled={pending}
        className="rounded-xl border px-5 py-3 font-medium hover:bg-gray-50 disabled:opacity-50"
      >
        {pending ? '解約処理中…' : label}
      </button>
    </div>
  );
}
