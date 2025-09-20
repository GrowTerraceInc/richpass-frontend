// app/settings/plan/PlanStatusCard.tsx
'use client';

import { useEffect, useState } from 'react';
import { getSubscriptionStatusApi, type SubscriptionStatusApi } from '../../lib/billingClient';

function formatYmd(iso?: string | null) {
  if (!iso) return '-';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '-';
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

export default function PlanStatusCard() {
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
    <section className="space-y-3">
      <h2 className="text-xl font-semibold">購読ステータス</h2>

      {loading && <div>読み込み中…</div>}

      {err && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-red-700 text-sm">
          {err}
        </div>
      )}

      {data && (
        <div className="rounded-xl border p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-500">状態（status）</div>
            <div className="font-mono">{data.status}</div>
          </div>
          <div>
            <div className="text-gray-500">プランID（current_plan_id）</div>
            <div className="font-mono">{data.current_plan_id ?? '-'}</div>
          </div>
          <div>
            <div className="text-gray-500">次回更新（renews_at）</div>
            <div className="font-mono">{formatYmd(data.renews_at)}</div>
          </div>
          <div>
            <div className="text-gray-500">支払い方法</div>
            <div className="font-mono">
              {data.payment_method
                ? `${data.payment_method.brand.toUpperCase()} •••• ${data.payment_method.last4}`
                : '-'}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
