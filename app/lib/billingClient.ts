// /app/lib/billingClient.ts
const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;

export type SubscriptionStatusApi = {
  status: 'current' | 'past_due' | 'canceled' | string;
  current_plan_id: string | null;
  renews_at: string | null; // ISO
  payment_method: null | {
    brand: string;
    last4: string;
  };
};

// APIからそのまま取得（UI側で安全に扱う）
export async function getSubscriptionStatusApi(): Promise<SubscriptionStatusApi> {
  const res = await fetch(`${API_BASE}/api/subscription/status`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });
  if (!res.ok) {
    // 呼び出し側で分岐できるよう、エラー内容は投げる
    const text = await res.text().catch(() => '');
    throw new Error(`status ${res.status}: ${text.slice(0,200)}`);
  }
  return res.json() as Promise<SubscriptionStatusApi>;
}
