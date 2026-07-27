import { NextRequest, NextResponse } from "next/server";
import { classifyMixture } from "@/lib/classification";
import type { MixtureIngredient, PhysicalForm, MixtureTestData } from "@/lib/classification/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const ingredients: MixtureIngredient[] = body.ingredients;
    const physicalForm: PhysicalForm = body.physicalForm ?? "liquid";
    const testData: MixtureTestData | undefined = body.testData;

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return NextResponse.json(
        { error: "At least one ingredient is required" },
        { status: 400 }
      );
    }

    const output = classifyMixture(ingredients, physicalForm, testData);
    return NextResponse.json(output);
  } catch {
    return NextResponse.json(
      { error: "Classification failed" },
      { status: 500 }
    );
  }
}
