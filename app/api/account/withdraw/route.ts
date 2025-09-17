// モックAPI：退会依頼を受け取り200を返すだけ。
// 本番ではここでユーザーの無効化／データ削除キュー投入／監査ログ等を実行します。
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("[withdraw]", body); // 確認用ログ
    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ ok: false }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}
