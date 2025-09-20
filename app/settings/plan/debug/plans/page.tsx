// app/settings/plan/debug/plans/page.tsx
export const dynamic = 'force-dynamic';

import { loadPlans } from '@/app/lib/billing';

export default async function DebugPlansPage() {
  const plans = await loadPlans();

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Plans Debug</h1>

      <section className="rounded-xl border p-4">
        <h2 className="font-semibold mb-2">plans の生データ</h2>
        <pre className="text-xs overflow-auto p-3 bg-gray-50 rounded-lg border">
{JSON.stringify(plans, null, 2)}
        </pre>
      </section>
    </main>
  );
}
