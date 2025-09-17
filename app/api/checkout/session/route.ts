// /app/api/checkout/session/route.ts
import Stripe from "stripe";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-08-27.basil",
});

// 初月無料：ENVで可変（0でトライアル無し）
const TRIAL_DAYS = Number(process.env.TRIAL_DAYS ?? "30");

export async function POST(req: Request) {
  try {
    // 事前適用したいプロモコードを受け取る（任意）
    let couponCode: string | null = null;
    try {
      const body = await req.json();
      if (typeof body?.couponCode === "string" && body.couponCode.trim()) {
        couponCode = body.couponCode.trim();
      }
    } catch { /* body無しでもOK */ }

    // プロモが有効なら discounts を用意
    let discounts: Stripe.Checkout.SessionCreateParams.Discount[] | undefined;
    if (couponCode) {
      const promos = await stripe.promotionCodes.list({
        code: couponCode,
        active: true,
        limit: 1,
      });
      if (promos.data[0]) {
        discounts = [{ promotion_code: promos.data[0].id }];
      }
    }

    // 共通パラメータ
    const params: Stripe.Checkout.SessionCreateParams = {
      mode: "subscription",
      payment_method_collection: "always",
      line_items: [
        {
          price: process.env.STRIPE_PRICE_MONTHLY_ID as string,
          quantity: 1,
        },
      ],
      automatic_tax: { enabled: false },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/subscribe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/subscribe`,
      locale: "ja",
    };

    // TRIAL_DAYS > 0 のときだけ初月無料を付与
    if (TRIAL_DAYS > 0) {
      params.subscription_data = { trial_period_days: TRIAL_DAYS };
    }

    // ★ 重要：allow_promotion_codes と discounts は排他
    if (discounts) {
      params.discounts = discounts;                 // 事前適用あり
    } else {
      params.allow_promotion_codes = true;          // 事前適用なし → 入力欄を出す
    }

    const session = await stripe.checkout.sessions.create(params);
    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Session create failed";
    console.error(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
