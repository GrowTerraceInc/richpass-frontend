// モックAPI：解約リクエストを受けて200を返すだけ。
// 本番ではここで Stripe の Subscription を更新（cancel_at_period_end or cancel_now）し、DBへ記録します。
export async function POST(req: Request) {
  try {
    const body = await req.json();
    // ここで body.atPeriodEnd / body.reason / body.details を使って保存や連携を行う
    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ ok: false }), { status: 400 });
  }
}
