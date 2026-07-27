import { NextRequest, NextResponse } from "next/server";
import { searchChemical } from "@/lib/chemical-search";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q");

  if (!query || query.trim().length === 0) {
    return NextResponse.json(
      { error: "Query parameter 'q' is required" },
      { status: 400 }
    );
  }

  const chemical = await searchChemical(query.trim());

  if (!chemical) {
    return NextResponse.json({ chemical: null });
  }

  return NextResponse.json({ chemical });
}
