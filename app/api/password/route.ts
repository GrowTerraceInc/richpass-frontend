type PasswordPayload = {
  currentPassword?: string;
  newPassword?: string;
};

export async function PUT(req: Request) {
  let body: PasswordPayload = {};
  try {
    body = (await req.json()) as PasswordPayload;
  } catch {
    // 何も入っていない/JSONでない場合
    return new Response(JSON.stringify({ ok: false, error: "INVALID_JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { currentPassword, newPassword } = body;

  // currentPassword の型チェック（未使用警告対策も兼ねて実際に検証）
  if (typeof currentPassword !== "string" || currentPassword.length === 0) {
    return new Response(JSON.stringify({ ok: false, error: "INVALID_CURRENT_PASSWORD" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // newPassword の最低要件（モック）
  if (typeof newPassword !== "string" || newPassword.length < 8) {
    return new Response(JSON.stringify({ ok: false, error: "WEAK_PASSWORD" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // ここで実際はDB更新・監査ログ等を実施
  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  });
}
