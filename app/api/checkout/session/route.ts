import { NextRequest, NextResponse } from 'next/server';

// ビルドを止めないための一時スタブ実装（APIキー不要）
export async function POST(_req: NextRequest) {
  return NextResponse.json({ ok: true });
}

export async function GET(_req: NextRequest) {
  return NextResponse.json({ ok: true });
}
