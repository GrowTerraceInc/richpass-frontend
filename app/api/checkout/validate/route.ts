import { NextRequest, NextResponse } from 'next/server';

// 一時スタブ：ビルドを止めないための最小実装（本実装は後で差し替え）
export async function POST(_req: NextRequest) {
  return NextResponse.json({ ok: true });
}
export async function GET(_req: NextRequest) {
  return NextResponse.json({ ok: true });
}
