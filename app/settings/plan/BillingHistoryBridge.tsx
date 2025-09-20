// app/settings/plan/BillingHistoryBridge.tsx
'use client';

import { useEffect, useState } from 'react';
import BillingHistoryList from '@/app/components/billing/BillingHistoryList';
import type { BillingHistoryItem } from '@/app/lib/billing';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;

type Props = {
  initialItems: BillingHistoryItem[];
  initialCount?: number;
  step?: number;
};

// created_at / createdAt / date のいずれでも受け取り、ISO文字列に正規化
function normalizeDate(v: unknown): string {
  if (typeof v === 'string') {
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? '' : d.toISOString();
  }
  if (typeof v === 'number') {
    const d = new Date(v * 1000);
    return Number.isNaN(d.getTime()) ? '' : d.toISOString();
  }
  return '';
}

function get(obj: unknown, key: string): unknown {
  return obj && typeof obj === 'object' ? (obj as Record<string, unknown>)[key] : undefined;
}

function getStr(obj: unknown, key: string, fallback = ''): string {
  const v = get(obj, key);
  return typeof v === 'string' ? v : fallback;
}

function getNum(obj: unknown, key: string, fallback = 0): number {
  const v = get(obj, key);
  if (typeof v === 'number') return v;
  if (typeof v === 'string') {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  }
  return fallback;
}

export default function BillingHistoryBridge({
  initialItems,
  initialCount = 12,
  step = 12,
}: Props) {
  const [items, setItems] = useState<BillingHistoryItem[]>(initialItems ?? []);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/billing/history`, {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!res.ok) return;

        const data: unknown = await res.json();
        if (!alive || !Array.isArray(data)) return;

        const mapped: BillingHistoryItem[] = data.map((row: unknown) => {
          const iso =
            normalizeDate(get(row, 'created_at')) ||
            normalizeDate(get(row, 'createdAt')) ||
            normalizeDate(get(row, 'date'));

          // backendの status は型に無いので description に要約（空でもOK）
          const statusRaw = getStr(row, 'status').toLowerCase();
          const statusDesc = statusRaw === 'paid' ? '' : statusRaw === '' ? '' : statusRaw;

          const item: BillingHistoryItem = {
            id: getStr(row, 'id'),
            date: iso,                                   // 必須（ISO）
            amount: getNum(row, 'amount'),
            currency: getStr(row, 'currency', 'jpy').toLowerCase(),
            description: getStr(row, 'description', statusDesc),
            receiptUrl:
              getStr(row, 'receipt_url') || getStr(row, 'receiptUrl') || '', // ★ 型に合わせて camelCase
          };

          return item;
        });

        setItems(mapped);
      } catch {
        // API失敗時は initialItems を維持
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <BillingHistoryList items={items} initialCount={initialCount} step={step} />
  );
}
