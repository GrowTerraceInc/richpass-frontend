"use client";
import Button from "@/app/components/ui/Button";
const API = process.env.NEXT_PUBLIC_API_ORIGIN!;
export default function RedirectToStripeButton() {
  const go = () => { window.location.href = `${API}/api/billing/payment-method/checkout/redirect`; };
  return <Button onClick={go} size="small">Stripeで変更する</Button>;
}
