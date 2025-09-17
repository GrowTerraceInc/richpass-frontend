import Stripe from "stripe";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {
  try {
    const { code } = await req.json();
    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { valid: false, message: "コードを入力してください。" },
        { status: 400 }
      );
    }
    const promos = await stripe.promotionCodes.list({ code, active: true, limit: 1 });
    return NextResponse.json({ valid: !!promos.data[0] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "検証に失敗しました。";
    return NextResponse.json({ valid: false, message }, { status: 500 });
  }
}
