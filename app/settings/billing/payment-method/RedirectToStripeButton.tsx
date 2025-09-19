"use client";
import Button from "@/app/components/ui/Button";
const API = process.env.NEXT_PUBLIC_API_ORIGIN!;
export default function RedirectToStripeButton() {
  const go = () => {
    // ← 目印 ?v=setup1 を付与
    window.location.href = `${API}/api/billing/payment-method/checkout/redirect?v=setup1`;
  };
  return <Button onClick={go} size="small">Stripeで変更する（setup1）</Button>;
}
