'use client';

import { useEffect, useState } from 'react';
import { getSubscriptionStatusApi, type SubscriptionStatusApi } from '../../../lib/billingClient';

export default function PlanDebugPage() {
  const [data, setData] = useState<SubscriptionStatusApi | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const j = await getSubscriptionStatusApi();
        if (!mounted) return;
        setData(j);
      } catch (e) {
        setErr(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Plan Debug</h1>

      {loading && <div>読み込み中…</div>}

      {err && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-red-700 text-sm">
          {err}
        </div>
      )}

      {data && (
        <div className="space-y-4">
          <section className="rounded-xl border p-4">
            <h2 className="font-semibold mb-2">主要フィールド</h2>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div><span className="text-gray-500">status:</span> <span className="font-mono">{data.status}</span></div>
              <div><span className="text-gray-500">current_plan_id:</span> <span className="font-mono">{data.current_plan_id ?? 'null'}</span></div>
              <div><span className="text-gray-500">renews_at:</span> <span className="font-mono">{data.renews_at ?? 'null'}</span></div>
              <div><span className="text-gray-500">payment_method:</span> <span className="font-mono">
                {data.payment_method ? `${data.payment_method.brand.toUpperCase()} •••• ${data.payment_method.last4}` : 'null'}
              </span></div>
            </div>
          </section>

          <section className="rounded-xl border p-4">
            <h2 className="font-semibold mb-2">レスポンス全文</h2>
            <pre className="text-xs overflow-auto p-3 bg-gray-50 rounded-lg border">
{JSON.stringify(data, null, 2)}
            </pre>
          </section>
        </div>
      )}
    </main>
  );
}
