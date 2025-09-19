import { cookies } from "next/headers";

const API =
  process.env.NEXT_PUBLIC_API_ORIGIN?.replace(/\/$/, "") ||
  "https://api.richpassapp.com";

/* ====== 既存の型（UI互換のため維持） ====== */
export type Plan = {
  planId: string;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
  stripePriceIdMonthly?: string;
  stripePriceIdYearly?: string;
};

export type SubscriptionStatus = {
  userId: string;
  status: "active" | "past_due" | "canceled";
  currentPlanId: string;
  renewsAt?: string; // ISO
  cancelAtPeriodEnd?: boolean;
  last4?: string;
};

export type BillingHistoryItem = {
  id: string;
  date: string; // ISO
  description: string;
  amount: number; // 整数円（JPYはゼロ小数）
  currency: string;
  receiptUrl?: string | null;
};

/* ====== APIレスポンスの型（any を使わない） ====== */
type ApiStatusRow = {
  current_plan_id?: string | null;
  status?: string | null; // 'current' | 'past_due' | 'canceled' | その他
  renews_at?: string | null;
  cancel_at_period_end?: boolean | null;
  last4?: string | null;
};
type ApiStatusResp = { status?: ApiStatusRow | null };

type ApiHistoryItem = {
  id: string | number;
  date: string;
  description?: string | null;
  amount?: number | string | null;
  currency?: string | null;
  receipt_url?: string | null;
  receiptUrl?: string | null; // 念のため両対応
};
type ApiHistoryResp = { items?: ApiHistoryItem[] };

/* ====== RSC から Cookie を転送して API を叩く ====== */
async function rscFetch<T>(path: string): Promise<T> {
  const jar = await cookies(); // ※あなたのメモ通り await 必須
  const cookieHeader = jar
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const res = await fetch(`${API}${path}`, {
    headers: { Accept: "application/json", Cookie: cookieHeader },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${path}`);
  return (await res.json()) as T;
}

/* ====== 実装 ====== */

// 1) プラン（表示名のための最小ダミー：UIを触らずに済む）
export async function loadPlans(): Promise<Plan[]> {
  return [
    { planId: "free", name: "FREE", priceMonthly: 0, priceYearly: 0, features: [] },
    { planId: "premium", name: "PREMIUM", priceMonthly: 980, priceYearly: 0, features: [] },
  ];
}

// 2) 現在プラン/更新日/末尾4桁
export async function loadSubscriptionStatus(
  userId = "u_demo_001" // 既存シグネチャ維持（UI互換のため残す）
): Promise<SubscriptionStatus | null> {
  try {
    const d = await rscFetch<ApiStatusResp>("/api/subscription/status");
    const s = d?.status ?? null;
    if (!s) return null;

    const mapStatus = (x: string | null | undefined): SubscriptionStatus["status"] => {
      if (x === "past_due") return "past_due";
      if (x === "canceled") return "canceled";
      return "active"; // 'current' などは active に寄せる
    };

    return {
      userId,
      status: mapStatus(s.status),
      currentPlanId: String(s.current_plan_id ?? "free"),
      renewsAt: s.renews_at ?? undefined,
      cancelAtPeriodEnd: !!s.cancel_at_period_end,
      last4: s.last4 ?? undefined,
    };
  } catch {
    return null;
  }
}

// 3) 請求履歴（最大24件）
export async function loadBillingHistory(
  _userId = "u_demo_001" // 既存シグネチャ維持（未使用のため _ プレフィックス）
): Promise<BillingHistoryItem[]> {
  void _userId;

  try {
    const d = await rscFetch<ApiHistoryResp>("/api/billing/history");
    const items = Array.isArray(d.items) ? d.items : [];

    const mapped: BillingHistoryItem[] = items.map((it) => {
      const url = it.receipt_url ?? it.receiptUrl ?? null;
      return {
        id: String(it.id),
        date: String(it.date),
        description: String(it.description ?? "ご利用料金"),
        amount: Number(it.amount ?? 0),
        currency: String(it.currency ?? "jpy"),
        receiptUrl: url,
      };
    });

    mapped.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return mapped;
  } catch {
    return [];
  }
}
