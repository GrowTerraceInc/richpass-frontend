import { NextResponse } from "next/server";
import { getTestById } from "@/app/lib/mockLoader";

export async function GET(
  _req: Request,
  { params }: { params: { testId: string } }
) {
  const data = await getTestById(params.testId);
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(data, { status: 200 });
}
