'use client';

import { useMemo } from 'react';
import type { SubscriptionStatus } from '@/app/lib/billing';

export default function PlanSummary({ data }: { data: SubscriptionStatus }) {
  const renewText = useMemo(() => {
    if (!data.renewsAt) return '–';
    const d = new Date(data.renewsAt);
    if (isNaN(d.getTime())) return '–';
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  }, [data.renewsAt]);

  const pmText = useMemo(() => {
    const last4 = data.last4 ?? null;
    if (!last4) return '–';
    return `•••• ${last4}`;
  }, [data.last4]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-gray-500">更新日</span>
        <span className="font-medium">{renewText}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-gray-500">お支払い方法</span>
        <span className="font-medium">{pmText}</span>
      </div>
    </div>
  );
}
