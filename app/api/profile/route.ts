export async function PUT(req: Request) {
  // ボディはモックのため読み捨て（未使用変数を作らない）
  await req.json().catch(() => ({}));

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  });
}
