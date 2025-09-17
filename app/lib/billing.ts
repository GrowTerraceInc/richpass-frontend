import fs from "node:fs/promises";
import path from "node:path";
import Papa, { ParseResult } from "papaparse";

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
  renewsAt?: string;                // ISO
  cancelAtPeriodEnd?: boolean;
  last4?: string;                   // 支払い方法の末尾4桁（モック）
};

export type BillingHistoryItem = {
  id: string;           // 取引ID or 請求ID（モック）
  date: string;         // ISO
  description: string;  // 例：8月利用料金
  amount: number;       // 税込金額 (整数円)
  currency: string;     // "JPY"
  receiptUrl?: string;  // StripeのHosted Invoice URLなど（任意）
};

type PlanCsv = {
  planId?: string;
  name?: string;
  priceMonthly?: string;
  priceYearly?: string;
  featuresJson?: string;
  stripePriceIdMonthly?: string;
  stripePriceIdYearly?: string;
};

type SubCsv = {
  userId?: string;
  status?: SubscriptionStatus["status"];
  currentPlanId?: string;
  renewsAt?: string;
  cancelAtPeriodEnd?: string | boolean;
  last4?: string;
};

type HistoryCsv = {
  userId?: string;
  id?: string;
  date?: string;
  description?: string;
  amount?: string;
  currency?: string;
  receiptUrl?: string;
};

async function readFirst(paths: string[]): Promise<string | null> {
  for (const p of paths) {
    try { return await fs.readFile(p, "utf-8"); } catch { /* try next */ }
  }
  return null;
}

function toBool(v: unknown, def = false): boolean {
  if (typeof v === "boolean") return v;
  const s = String(v ?? "").trim().toLowerCase();
  if (!s) return def;
  return s === "true" || s === "1" || s === "yes";
}

export async function loadPlans(): Promise<Plan[]> {
  const cwd = process.cwd();
  const candidates = [
    path.join(cwd, "app", "mock", "Plans.csv"),
    path.join(cwd, "app", "mock", "plans.csv"),
    path.join(cwd, "public", "mock", "Plans.csv"),
    path.join(cwd, "public", "mock", "plans.csv"),
  ];
  const csv = await readFirst(candidates);
  if (!csv) return [];
  const parsed: ParseResult<PlanCsv> = Papa.parse<PlanCsv>(csv, { header: true, skipEmptyLines: true });
  return parsed.data.map((r) => ({
    planId: String(r.planId ?? "").trim(),
    name: String(r.name ?? "").trim(),
    priceMonthly: Number(r.priceMonthly ?? 0),
    priceYearly: Number(r.priceYearly ?? 0),
    features: r.featuresJson ? safeParseFeatures(r.featuresJson) : [],
    stripePriceIdMonthly: r.stripePriceIdMonthly || undefined,
    stripePriceIdYearly: r.stripePriceIdYearly || undefined,
  })).filter(p => p.planId && p.name);
}

function safeParseFeatures(s: string): string[] {
  try {
    const v = JSON.parse(s);
    return Array.isArray(v) ? v.map(x => String(x)) : [];
  } catch {
    return [];
  }
}

export async function loadSubscriptionStatus(userId = "u_demo_001"): Promise<SubscriptionStatus | null> {
  const cwd = process.cwd();
  const candidates = [
    path.join(cwd, "app", "mock", "Subscription_Status.csv"),
    path.join(cwd, "app", "mock", "subscription_status.csv"),
    path.join(cwd, "public", "mock", "Subscription_Status.csv"),
    path.join(cwd, "public", "mock", "subscription_status.csv"),
  ];
  const csv = await readFirst(candidates);
  if (!csv) return null;
  const parsed: ParseResult<SubCsv> = Papa.parse<SubCsv>(csv, { header: true, skipEmptyLines: true });
  const row = parsed.data.find(r => String(r.userId ?? "").trim() === userId);
  if (!row) return null;
  return {
    userId,
    status: (row.status ?? "active"),
    currentPlanId: String(row.currentPlanId ?? "free"),
    renewsAt: row.renewsAt || undefined,
    cancelAtPeriodEnd: toBool(row.cancelAtPeriodEnd, false),
    last4: row.last4 || undefined,
  };
}

export async function loadBillingHistory(userId = "u_demo_001"): Promise<BillingHistoryItem[]> {
  const cwd = process.cwd();
  const candidates = [
    path.join(cwd, "app", "mock", "Billing_History.csv"),
    path.join(cwd, "app", "mock", "billing_history.csv"),
    path.join(cwd, "public", "mock", "Billing_History.csv"),
    path.join(cwd, "public", "mock", "billing_history.csv"),
  ];
  const csv = await readFirst(candidates);
  if (!csv) return [];
  const parsed: ParseResult<HistoryCsv> = Papa.parse<HistoryCsv>(csv, { header: true, skipEmptyLines: true });
  const rows = parsed.data.filter(r => String(r.userId ?? "").trim() === userId);
  const items = rows.map((r) => ({
    id: String(r.id ?? "").trim(),
    date: String(r.date ?? ""),
    description: String(r.description ?? ""),
    amount: Number(r.amount ?? 0),
    currency: String(r.currency ?? "JPY"),
    receiptUrl: r.receiptUrl || undefined,
  })).filter(x => x.id && x.date);
  items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return items;
}
