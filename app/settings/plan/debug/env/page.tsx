// app/settings/plan/debug/env/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { getSubscriptionStatusApi } from '../../../../lib/billingClient';

type SubscriptionStatusApi = {
  status: 'current' | 'past_due' | 'canceled' | string;
  current_plan_id: string | null;
  renews_at: string | null;
  payment_method: null | { brand: string; last4: string };
};

export default function EnvDebugPage() {
  const [status, setStatus] = useState<SubscriptionStatusApi | null>(null);
  const [err, setErr] = useState<string | null>(null);

  // ビルド時に埋め込まれたENV（空なら '(empty)'）
  const rawEnv =
    (process.env.NEXT_PUBLIC_PREMIUM_PRICE_IDS as string | undefined) ?? '(empty)';
  const tokens = rawEnv
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  useEffect(() => {
    (async () => {
      try {
        const j = await getSubscriptionStatusApi();
        setStatus(j);
      } catch (e) {
        setErr(e instanceof Error ? e.message : String(e));
      }
    })();
  }, []);

  const current = status?.current_plan_id ?? null;
  const currentTrim = current ? current.trim() : null;
  const included = currentTrim ? tokens.includes(currentTrim) : false;

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">ENV / price_id 照合デバッグ</h1>

      {err && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-red-700 text-sm">
          {err}
        </div>
      )}

      <section className="rounded-xl border p-4">
        <h2 className="font-semibold mb-2">ビルド時ENV（NEXT_PUBLIC_PREMIUM_PRICE_IDS）</h2>
        <div className="text-sm">
          <div className="text-gray-500">raw:</div>
          <pre className="text-xs overflow-auto p-3 bg-gray-50 rounded-lg border">
{rawEnv}
          </pre>
          <div className="text-gray-500 mt-2">tokens（split/trim後）:</div>
          <pre className="text-xs overflow-auto p-3 bg-gray-50 rounded-lg border">
{JSON.stringify(tokens, null, 2)}
          </pre>
        </div>
      </section>

      <section className="rounded-xl border p-4">
        <h2 className="font-semibold mb-2">現在の購読ステータス（抜粋）</h2>
        <div className="text-sm grid gap-2">
          <div>
            <span className="text-gray-500">current_plan_id (raw): </span>
            <span className="font-mono">{current ?? 'null'}</span>
          </div>
          <div>
            <span className="text-gray-500">current_plan_id (trim): </span>
            <span className="font-mono">{currentTrim ?? 'null'}</span>
          </div>
          <div>
            <span className="text-gray-500">tokens に含まれるか？: </span>
            <span className="font-mono">{included ? 'true' : 'false'}</span>
          </div>
        </div>
      </section>
    </main>
  );
}
