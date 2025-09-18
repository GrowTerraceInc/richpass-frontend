import { NextRequest, NextResponse } from 'next/server';

/**
 * Minimal typed route for Next.js 15
 * context.params は Promise<{ testId: string }> を await して取り出す
 */
export async function GET(_req: NextRequest, context: { params: Promise<{ testId: string }> }) {
  const { testId } = await context.params;
  // TODO: 本実装に差し替え。いまは型を満たすスタブを返すだけ
  return NextResponse.json({ ok: true, testId });
}
