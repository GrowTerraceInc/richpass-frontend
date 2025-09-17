import Stripe from "stripe";

export async function POST() {
  const base =
    process.env.NEXT_PUBLIC_APP_ORIGIN?.replace(/\/$/, "") || "http://localhost:3000";
  const fallbackUrl = `${base}/settings/billing/payment-method/success`;

  const secret = process.env.STRIPE_SECRET_KEY;
  const customerId = process.env.STRIPE_TEST_CUSTOMER; // 本番はログインユーザーから取得

  // どちらか欠けていれば即フォールバック（開発用）
  if (!secret || !customerId) {
    return new Response(JSON.stringify({ url: fallbackUrl }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // apiVersionは指定せず、SDKに任せる
    const stripe = new Stripe(secret);
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${base}/settings/plan`,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    // 失敗時はフォールバックでブロッキングを回避
    console.error("[stripe portal] failed:", err);
    return new Response(JSON.stringify({ url: fallbackUrl }), {
      headers: { "Content-Type": "application/json" },
    });
  }
}
