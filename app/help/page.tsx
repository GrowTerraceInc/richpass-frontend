export const dynamic = "force-dynamic";

import fs from "node:fs/promises";
import path from "node:path";
import Papa from "papaparse";
import HelpClient, { FaqItem } from "./HelpClient";
import Breadcrumbs from "@/app/components/breadcrumbs/Breadcrumbs";

type FaqCsvRow = {
  category?: string | null;
  question?: string | null;
  answerMd?: string | null;
  order?: string | number | null;
};

async function loadFaq(): Promise<FaqItem[]> {
  const candidates = [
    path.join(process.cwd(), "app", "mock", "faq.csv"),
    path.join(process.cwd(), "public", "mock", "faq.csv"),
  ];

  let csv: string | null = null;
  for (const p of candidates) {
    try {
      csv = await fs.readFile(p, "utf-8");
      break;
    } catch {}
  }
  if (!csv) return [];

  const parsed = Papa.parse<FaqCsvRow>(csv, { header: true, skipEmptyLines: true });
  const rows = parsed.data;

  const items: FaqItem[] = rows
    .map((r): FaqItem => {
      const category = String(r.category ?? "").trim() || "その他";
      const question = String(r.question ?? "").trim();
      const answerMd = String(r.answerMd ?? "").trim();
      const o = r.order;
      const order =
        typeof o === "number"
          ? o
          : typeof o === "string" && o.trim() !== ""
          ? Number(o)
          : undefined;

      return { category, question, answerMd, order };
    })
    .filter((x) => x.question.length > 0 && x.answerMd.length > 0);

  return items;
}

export default async function HelpPage() {
  const items = await loadFaq();

  return (
    <main className="container">
      <div className="header">
        <Breadcrumbs
          items={[
            { label: "マイページ", href: "/mypage" },
            { label: "ヘルプ / FAQ", href: "/help" },
          ]}
        />
      </div>

      <h1 className="h2" style={{ textAlign: "center", marginBottom: 16 }}>
        ヘルプ / FAQ
      </h1>

      <HelpClient items={items} />
    </main>
  );
}
