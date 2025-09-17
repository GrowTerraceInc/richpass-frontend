"use client";

import { useState } from "react";
import Button from "@/app/components/ui/Button";

export default function RedirectToStripeButton() {
  const [loading, setLoading] = useState(false);

  const go = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = (await res.json()) as { url: string };
      window.location.href = data.url;
    } catch {
      alert("遷移に失敗しました。時間をおいて再度お試しください。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={go} size="small" disabled={loading} aria-busy={loading}>
      {loading ? "遷移中…" : "Stripeで変更する"}
    </Button>
  );
}
