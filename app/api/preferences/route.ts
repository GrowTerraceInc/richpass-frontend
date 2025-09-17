type PrefsPayload = {
  notifyEmail?: boolean;
  productEmail?: boolean;
  marketingOptIn?: boolean;
  notifyPush?: boolean;
  notifyInApp?: boolean;
};

export async function PUT(req: Request) {
  let body: PrefsPayload;
  try {
    body = (await req.json()) as PrefsPayload;
  } catch {
    return new Response(JSON.stringify({ ok: false, error: "INVALID_JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 本番ではここで認証ユーザーのUserPreferencesを更新
  // いまはモック応答のみ
  return new Response(JSON.stringify({ ok: true, saved: body ?? {} }), {
    headers: { "Content-Type": "application/json" },
  });
}
