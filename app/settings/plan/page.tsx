export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import Breadcrumbs from '@/app/components/breadcrumbs/Breadcrumbs';
import LinkButton from '@/app/components/ui/LinkButton';
import styles from './PlanPage.module.css';
import BillingHistoryList from '@/app/components/billing/BillingHistoryList';
import type { BillingHistoryItem } from '@/app/lib/billing';

// NEW: PlanStatusCard を動的インポート
import NextDynamic from 'next/dynamic';
const PlanStatusCard = NextDynamic(() => import('./PlanStatusCard'), { ssr: false });

export default async function PlanPage() {
  const emptyHistoryItems: BillingHistoryItem[] = [];
  return (
    <main className="max-w-4xl mx-auto p-6 space-y-12">
      <Breadcrumbs
        items={[
          { href: '/settings', label: '設定' },
          { href: '/settings/plan', label: 'プラン管理' },
        ]}
      />

      <h1 className="text-2xl font-bold">プラン管理</h1>

      {/* ★ここに購読ステータスカードを差し込み ★ */}
      <PlanStatusCard />

      {/* 以降、既存の UI コンテンツ（例: プラン情報や履歴一覧） */}
      <section className={styles.section}>
        <h2 className="text-xl font-semibold">お支払い履歴</h2>
        <Suspense fallback={<div>読み込み中…</div>}>
          <BillingHistoryList items={emptyHistoryItems} />
        </Suspense>
      </section>

      <div className="flex justify-end">
        <LinkButton href="/settings" variant="secondary">
          設定に戻る
        </LinkButton>
      </div>
    </main>
  );
}
