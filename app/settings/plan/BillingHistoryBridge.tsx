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
        const data = await res.json();
        if (!alive) return;
        if (Array.isArray(data)) {
          setItems(data as BillingHistoryItem[]);
        }
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
