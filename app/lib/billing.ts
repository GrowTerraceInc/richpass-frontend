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

/* ====== APIレスポンスの型（両対応） ======
   1) 旧: { status: { current_plan_id, status, renews_at, cancel_at_period_end, last4 } }
   2) 新: { current_plan_id, status, renews_at, payment_method: { brand, last4 } }
================================================ */
type ApiStatusRowLegacy = {
  current_plan_id?: string | null;
  status?: string | null;
  renews_at?: string | null;
  cancel_at_period_end?: boolean | null;
  last4?: string | null;
};
type ApiStatusLegacy = { status?: ApiStatusRowLegacy | null };

type ApiStatusFlat = {
  current_plan_id?: string | null;
  status?: string | null;
  renews_at?: string | null;
  cancel_at_period_end?: boolean | null;
  last4?: string | null; // 互換のため存在するかもしれない
  payment_method?: {
    brand?: string | null;
    last4?: string | null;
  } | null;
};

/* 履歴レスポンス（既存どおり） */
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
  const jar = await cookies(); // await 必須
  const cookieHeader = jar
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const res = await fetch(`${API}${path}`, {
    headers: { Accept: "application/json", Cookie: cookieHeader },
    cache: "no-store",
    credentials: "include",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${path}`);
  return (await res.json()) as T;
}

/* ====== ユーティリティ：型ガード ====== */
function isLegacyStatus(resp: ApiStatusLegacy | ApiStatusFlat): resp is ApiStatusLegacy {
  // 旧形式は top-level に "status" オブジェクトを持つ
  return typeof (resp as ApiStatusLegacy).status !== "undefined";
}

/* ====== 実装 ====== */

// 1) プラン（表示名のための最小ダミー：UIを触らずに済む）
export async function loadPlans(): Promise<Plan[]> {
  return [
    { planId: "free", name: "FREE", priceMonthly: 0, priceYearly: 0, features: [] },
    { planId: "premium", name: "PREMIUM", priceMonthly: 980, priceYearly: 0, features: [] },
  ];
}

// 2) 現在プラン/更新日/末尾4桁（旧/新APIどちらにも対応）
export async function loadSubscriptionStatus(
  userId = "u_demo_001" // 既存シグネチャ維持（UI互換のため残す）
): Promise<SubscriptionStatus | null> {
  try {
    const raw = await rscFetch<ApiStatusLegacy | ApiStatusFlat>("/api/subscription/status");

    let current_plan_id: string | null = "free";
    let statRaw: string | null = "active";
    let renews_at: string | null = null;
    let cancel_at_period_end = false;
    let last4: string | undefined;

    if (isLegacyStatus(raw)) {
      const s = raw.status ?? null;
      current_plan_id = s?.current_plan_id ?? "free";
      statRaw = s?.status ?? "active";
      renews_at = s?.renews_at ?? null;
      cancel_at_period_end = Boolean(s?.cancel_at_period_end);
      last4 = s?.last4 ?? undefined;
    } else {
      current_plan_id = raw.current_plan_id ?? "free";
      statRaw = raw.status ?? "active";
      renews_at = raw.renews_at ?? null;
      cancel_at_period_end = Boolean(raw.cancel_at_period_end);
      last4 = raw.payment_method?.last4 ?? raw.last4 ?? undefined;
    }

    const mapStatus = (x: string | null | undefined): SubscriptionStatus["status"] => {
      if (x === "past_due") return "past_due";
      if (x === "canceled") return "canceled";
      return "active"; // 'active' / 'trialing' / 'current' などは active に寄せる
    };

    return {
      userId,
      status: mapStatus(statRaw),
      currentPlanId: String(current_plan_id ?? "free"),
      renewsAt: renews_at ?? undefined,
      cancelAtPeriodEnd: cancel_at_period_end || undefined,
      last4,
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
        amount: Number(it.amount ?? 0), // ※APIは“円”で返ってくる前提
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
