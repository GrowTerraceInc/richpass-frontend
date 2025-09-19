import { redirect } from "next/navigation";

export default function Page({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(searchParams)) {
    if (typeof v === "string") qs.append(k, v);
    else if (Array.isArray(v)) v.forEach((x) => typeof x === "string" && qs.append(k, x));
  }
  redirect(`/settings/billing/payment-method/result${qs.toString() ? "?" + qs.toString() : ""}`);
}
